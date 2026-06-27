'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'

type Category = {
  id: string
  name: string
  description: string | null
  display_order: number
}

type MenuItem = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number | null
  is_available: boolean
  display_order: number
}

type ItemForm = {
  name: string
  description: string
  price: string
  is_available: boolean
  category_id: string
}

type CatForm = {
  name: string
  description: string
}

const EMPTY_ITEM: ItemForm = {
  name: '',
  description: '',
  price: '',
  is_available: true,
  category_id: '',
}

const EMPTY_CAT: CatForm = {
  name: '',
  description: '',
}

const currency = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
})

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">
      <circle cx="5" cy="3.5" r="1.4" />
      <circle cx="11" cy="3.5" r="1.4" />
      <circle cx="5" cy="8" r="1.4" />
      <circle cx="11" cy="8" r="1.4" />
      <circle cx="5" cy="12.5" r="1.4" />
      <circle cx="11" cy="12.5" r="1.4" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const inputCls =
  'w-full px-3 py-2 bg-white text-[#1F2D21] rounded-lg border border-[#D8CCB8] focus:outline-none focus:border-[#4A7C59] transition text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-[#6A5A43] block mb-1">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        on ? 'bg-[#4A7C59]' : 'bg-[#C8B89A]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-red-700 text-sm mb-4 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
      {children}
    </p>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-[#1F2A20]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FFF9F0] border border-[#D8CCB8] rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

function ModalButtons({
  onCancel,
  onSave,
  saving,
  label,
}: {
  onCancel: () => void
  onSave: () => void
  saving: boolean
  label: string
}) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 bg-[#E8E0D0] hover:bg-[#D8CCB8] text-[#6A5A43] rounded-lg transition text-sm"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex-1 py-2.5 bg-[#2A3A2D] hover:bg-[#1F2D21] text-white font-semibold rounded-lg transition text-sm disabled:opacity-50"
      >
        {saving ? 'Saving...' : label}
      </button>
    </div>
  )
}

function SortableItemRow({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const [confirming, setConfirming] = useState(false)

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="border-b border-[#D8CCB8]/70 pb-4 last:border-b-0 last:pb-0"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="mt-1.5 flex-shrink-0 cursor-grab active:cursor-grabbing text-[#C8B89A] hover:text-[#6A5A43] touch-none"
          title="Drag to reorder"
        >
          <GripIcon />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3
              className={`text-lg font-semibold text-[#223525] ${
                !item.is_available ? 'line-through opacity-40' : ''
              }`}
            >
              {item.name}
            </h3>
            {item.price != null && (
              <p className="whitespace-nowrap text-sm font-semibold text-[#6A5A43] flex-shrink-0">
                {currency.format(item.price)}
              </p>
            )}
          </div>
          {item.description && (
            <p className="mt-1 text-sm text-[#2A3A2D]/75">{item.description}</p>
          )}
          {!item.is_available && (
            <span className="mt-1 inline-block text-xs text-red-500/70">Unavailable</span>
          )}
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 bg-[#E8E0D0] text-[#6A5A43] rounded-lg hover:bg-[#D8CCB8] transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-1.5 text-[#A89A84] hover:text-[#1F2D21] hover:bg-[#EDE6D8] rounded-lg transition"
                title="Edit item"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="p-1.5 text-[#A89A84] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete item"
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

function SortableCategoryCard({
  category,
  items,
  onEditCategory,
  onDeleteCategory,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onItemDragEnd,
}: {
  category: Category
  items: MenuItem[]
  onEditCategory: (cat: Category) => void
  onDeleteCategory: (id: string) => void
  onEditItem: (item: MenuItem) => void
  onDeleteItem: (id: string) => void
  onAddItem: (categoryId: string) => void
  onItemDragEnd: (event: DragEndEvent, categoryId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const [confirmDelete, setConfirmDelete] = useState(false)

  const itemSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="rounded-2xl border border-[#D8CCB8] bg-[#FFF9F0] p-6 shadow-sm"
    >
      <div className="flex items-start gap-2 mb-5">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="mt-2 flex-shrink-0 cursor-grab active:cursor-grabbing text-[#C8B89A] hover:text-[#6A5A43] touch-none"
          title="Drag to reorder section"
        >
          <GripIcon />
        </button>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-3xl text-[#1F2D21]">{category.name}</h2>
          {category.description && (
            <p className="mt-1 text-sm text-[#2A3A2D]/70">{category.description}</p>
          )}
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0 mt-1">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-xs text-[#6A5A43]">Delete this section?</span>
              <button
                type="button"
                onClick={() => onDeleteCategory(category.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-2 py-1 bg-[#E8E0D0] text-[#6A5A43] rounded-lg hover:bg-[#D8CCB8] transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEditCategory(category)}
                className="p-1.5 text-[#A89A84] hover:text-[#1F2D21] hover:bg-[#EDE6D8] rounded-lg transition"
                title="Edit section"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-[#A89A84] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete section"
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>

      <DndContext
        id={`items-dnd-context-${category.id}`}
        sensors={itemSensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => onItemDragEnd(e, category.id)}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-5">
            {items.length === 0 && (
              <li className="py-6 text-center text-sm text-[#A89A84]">
                No items yet. Add one below.
              </li>
            )}
            {items.map((item) => (
              <SortableItemRow
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => onAddItem(category.id)}
        className="mt-6 w-full py-2.5 border border-dashed border-[#C8B89A] text-[#6A5A43] text-sm rounded-xl hover:border-[#4A7C59] hover:bg-[#F5F0E8] transition"
      >
        + Add Item
      </button>
    </article>
  )
}

export default function MenuManager({
  initialCategories,
  initialItems,
}: {
  initialCategories: Category[]
  initialItems: MenuItem[]
}) {
  const supabase = createClient()

  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [items, setItems] = useState<MenuItem[]>(initialItems)

  const [itemModal, setItemModal] = useState<{
    open: boolean
    editing: MenuItem | null
  }>({ open: false, editing: null })
  const [itemCategoryId, setItemCategoryId] = useState('')
  const [itemForm, setItemForm] = useState<ItemForm>(EMPTY_ITEM)
  const [itemSaving, setItemSaving] = useState(false)
  const [itemError, setItemError] = useState('')

  const [catModal, setCatModal] = useState<{
    open: boolean
    editing: Category | null
  }>({ open: false, editing: null })
  const [catForm, setCatForm] = useState<CatForm>(EMPTY_CAT)
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState('')

  const categorySensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function getItemsForCategory(id: string) {
    return items
      .filter((i) => i.category_id === id)
      .sort((a, b) => a.display_order - b.display_order)
  }

  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const reordered = arrayMove(
      categories,
      categories.findIndex((c) => c.id === active.id),
      categories.findIndex((c) => c.id === over.id),
    )
    setCategories(reordered)

    await Promise.all(
      reordered.map((cat, i) =>
        supabase.from('menu_categories').update({ display_order: i }).eq('id', cat.id),
      ),
    )
  }

  async function handleItemDragEnd(event: DragEndEvent, categoryId: string) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const catItems = getItemsForCategory(categoryId)
    const reordered = arrayMove(
      catItems,
      catItems.findIndex((i) => i.id === active.id),
      catItems.findIndex((i) => i.id === over.id),
    ).map((item, idx) => ({ ...item, display_order: idx }))

    setItems((prev) => [
      ...prev.filter((i) => i.category_id !== categoryId),
      ...reordered,
    ])

    await Promise.all(
      reordered.map((item) =>
        supabase
          .from('menu_items')
          .update({ display_order: item.display_order })
          .eq('id', item.id),
      ),
    )
  }

  function openAddItem(categoryId: string) {
    setItemCategoryId(categoryId)
    setItemForm({ ...EMPTY_ITEM, category_id: categoryId })
    setItemModal({ open: true, editing: null })
    setItemError('')
  }

  function openEditItem(item: MenuItem) {
    setItemCategoryId(item.category_id ?? '')
    setItemForm({
      name: item.name,
      description: item.description ?? '',
      price: item.price?.toString() ?? '',
      is_available: item.is_available,
      category_id: item.category_id ?? '',
    })
    setItemModal({ open: true, editing: item })
    setItemError('')
  }

  function closeItemModal() {
    setItemModal({ open: false, editing: null })
    setItemForm(EMPTY_ITEM)
    setItemError('')
  }

  async function handleSaveItem() {
    if (!itemForm.name.trim()) {
      setItemError('Name is required.')
      return
    }
    setItemSaving(true)
    setItemError('')

    const payload = {
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || null,
      price: itemForm.price !== '' ? parseFloat(itemForm.price) : null,
      is_available: itemForm.is_available,
      category_id: itemForm.category_id || null,
      updated_at: new Date().toISOString(),
    }

    if (itemModal.editing) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', itemModal.editing.id)
        .select()
        .single()
      if (error) {
        setItemError(error.message)
        setItemSaving(false)
        return
      }
      setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
    } else {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({ ...payload, display_order: getItemsForCategory(itemCategoryId).length })
        .select()
        .single()
      if (error) {
        setItemError(error.message)
        setItemSaving(false)
        return
      }
      setItems((prev) => [...prev, data])
    }

    setItemSaving(false)
    closeItemModal()
  }

  async function handleDeleteItem(id: string) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function openAddCategory() {
    setCatForm(EMPTY_CAT)
    setCatModal({ open: true, editing: null })
    setCatError('')
  }

  function openEditCategory(cat: Category) {
    setCatForm({ name: cat.name, description: cat.description ?? '' })
    setCatModal({ open: true, editing: cat })
    setCatError('')
  }

  function closeCatModal() {
    setCatModal({ open: false, editing: null })
    setCatForm(EMPTY_CAT)
    setCatError('')
  }

  async function handleSaveCategory() {
    if (!catForm.name.trim()) {
      setCatError('Name is required.')
      return
    }
    setCatSaving(true)
    setCatError('')

    const payload = {
      name: catForm.name.trim(),
      description: catForm.description.trim() || null,
    }

    if (catModal.editing) {
      const { data, error } = await supabase
        .from('menu_categories')
        .update(payload)
        .eq('id', catModal.editing.id)
        .select()
        .single()
      if (error) {
        setCatError(error.message)
        setCatSaving(false)
        return
      }
      setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)))
    } else {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({ ...payload, display_order: categories.length })
        .select()
        .single()
      if (error) {
        setCatError(error.message)
        setCatSaving(false)
        return
      }
      setCategories((prev) => [...prev, data])
    }

    setCatSaving(false)
    closeCatModal()
  }

  async function handleDeleteCategory(id: string) {
    const { error } = await supabase.from('menu_categories').delete().eq('id', id)
    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setItems((prev) =>
        prev.map((i) => (i.category_id === id ? { ...i, category_id: null } : i)),
      )
    }
  }

  return (
    <div>
      <DndContext
        id="categories-dnd-context"
        sensors={categorySensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((cat) => (
              <SortableCategoryCard
                key={cat.id}
                category={cat}
                items={getItemsForCategory(cat.id)}
                onEditCategory={openEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditItem={openEditItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={openAddItem}
                onItemDragEnd={handleItemDragEnd}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={openAddCategory}
        className="mt-8 w-full py-3 border-2 border-dashed border-[#C8B89A] text-[#6A5A43] text-sm rounded-2xl hover:border-[#4A7C59] hover:bg-[#FFF9F0] transition"
      >
        + Add Menu Section
      </button>

      {itemModal.open && (
        <Modal onClose={closeItemModal}>
          <h2 className="font-display text-2xl text-[#1F2D21] mb-5">
            {itemModal.editing ? 'Edit Item' : 'Add Item'}
          </h2>
          {itemError && <ErrorMsg>{itemError}</ErrorMsg>}
          <div className="space-y-4">
            <Field label="Name *">
              <input
                autoFocus
                type="text"
                value={itemForm.name}
                onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveItem()}
                placeholder="e.g. Grilled River Fish"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={itemForm.description}
                onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                placeholder="Short description shown on the menu..."
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="Price (LKR)">
              <input
                type="number"
                value={itemForm.price}
                onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0"
                min="0"
                step="1"
                className={inputCls}
              />
            </Field>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-[#6A5A43]">Available on menu</span>
              <Toggle
                on={itemForm.is_available}
                onToggle={() =>
                  setItemForm((p) => ({ ...p, is_available: !p.is_available }))
                }
              />
            </div>
          </div>
          <ModalButtons
            onCancel={closeItemModal}
            onSave={handleSaveItem}
            saving={itemSaving}
            label={itemModal.editing ? 'Save Changes' : 'Add Item'}
          />
        </Modal>
      )}

      {catModal.open && (
        <Modal onClose={closeCatModal}>
          <h2 className="font-display text-2xl text-[#1F2D21] mb-5">
            {catModal.editing ? 'Edit Section' : 'Add Menu Section'}
          </h2>
          {catError && <ErrorMsg>{catError}</ErrorMsg>}
          <div className="space-y-4">
            <Field label="Section Name *">
              <input
                autoFocus
                type="text"
                value={catForm.name}
                onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
                placeholder="e.g. Rice and Curry"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={catForm.description}
                onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                placeholder="Optional tagline shown under the section title..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
          <ModalButtons
            onCancel={closeCatModal}
            onSave={handleSaveCategory}
            saving={catSaving}
            label={catModal.editing ? 'Save Changes' : 'Add Section'}
          />
        </Modal>
      )}
    </div>
  )
}