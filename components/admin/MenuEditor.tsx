'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: string
  name: string
  display_order: number
}

type MenuItem = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  is_available: boolean
  display_order: number
}

type ItemFormData = {
  name: string
  description: string
  price: string
  image_url: string
  category_id: string
  is_available: boolean
}

const EMPTY_FORM: ItemFormData = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category_id: '',
  is_available: true,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MenuEditor({
  initialCategories,
  initialItems,
}: {
  initialCategories: Category[]
  initialItems: MenuItem[]
}) {
  const supabase = createClient()

  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategories[0]?.id ?? null
  )

  // Modal state
  const [modal, setModal] = useState<{ open: boolean; editing: MenuItem | null }>({
    open: false,
    editing: null,
  })
  const [form, setForm] = useState<ItemFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Category add state
  const [newCatName, setNewCatName] = useState('')
  const [addingCat, setAddingCat] = useState(false)

  // Inline delete confirm
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null)

  const filteredItems = items
    .filter(i => i.category_id === activeCategory)
    .sort((a, b) => a.display_order - b.display_order)

  // ─── Modal helpers ──────────────────────────────────────────────────────────

  function openAdd() {
    setForm({ ...EMPTY_FORM, category_id: activeCategory ?? '' })
    setModal({ open: true, editing: null })
    setFormError('')
  }

  function openEdit(item: MenuItem) {
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: item.price?.toString() ?? '',
      image_url: item.image_url ?? '',
      category_id: item.category_id ?? '',
      is_available: item.is_available,
    })
    setModal({ open: true, editing: item })
    setFormError('')
  }

  function closeModal() {
    setModal({ open: false, editing: null })
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function updateForm<K extends keyof ItemFormData>(key: K, value: ItemFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ─── Item mutations ─────────────────────────────────────────────────────────

  async function handleSaveItem() {
    if (!form.name.trim()) {
      setFormError('Name is required.')
      return
    }

    setSaving(true)
    setFormError('')

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price !== '' ? parseFloat(form.price) : null,
      image_url: form.image_url.trim() || null,
      category_id: form.category_id || null,
      is_available: form.is_available,
      updated_at: new Date().toISOString(),
    }

    if (modal.editing) {
      // Update
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', modal.editing.id)
        .select()
        .single()

      if (error) { setFormError(error.message); setSaving(false); return }
      setItems(prev => prev.map(i => (i.id === data.id ? data : i)))
    } else {
      // Insert
      const insertPayload = {
        ...payload,
        display_order: items.filter(i => i.category_id === form.category_id).length,
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert(insertPayload)
        .select()
        .single()

      if (error) { setFormError(error.message); setSaving(false); return }
      setItems(prev => [...prev, data])
    }

    setSaving(false)
    closeModal()
  }

  async function handleDeleteItem(id: string) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) setItems(prev => prev.filter(i => i.id !== id))
    setDeletingItemId(null)
  }

  async function handleToggleAvailability(item: MenuItem) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
      .eq('id', item.id)
      .select()
      .single()

    if (!error && data) setItems(prev => prev.map(i => (i.id === data.id ? data : i)))
  }

  // ─── Category mutations ─────────────────────────────────────────────────────

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)

    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ name: newCatName.trim(), display_order: categories.length })
      .select()
      .single()

    if (!error && data) {
      setCategories(prev => [...prev, data])
      setActiveCategory(data.id)
      setNewCatName('')
    }
    setAddingCat(false)
  }

  async function handleDeleteCategory(id: string) {
    const { error } = await supabase.from('menu_categories').delete().eq('id', id)
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id))
      // Orphan items (set category_id to null) - DB handles this via ON DELETE SET NULL
      setItems(prev => prev.map(i => i.category_id === id ? { ...i, category_id: null } : i))
      if (activeCategory === id) {
        setActiveCategory(categories.find(c => c.id !== id)?.id ?? null)
      }
    }
    setDeletingCatId(null)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── Category tabs ── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-1 group">
            <button
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {cat.name}
              <span className="ml-2 text-xs opacity-60">
                ({items.filter(i => i.category_id === cat.id).length})
              </span>
            </button>

            {/* Delete category - two-step confirm */}
            {deletingCatId === cat.id ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-xs px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setDeletingCatId(null)}
                  className="text-xs px-2 py-1 bg-stone-800 text-stone-300 rounded transition"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeletingCatId(cat.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-red-400 text-sm px-1 transition"
                title="Delete category"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* ── Inline add category ── */}
        <div className="flex items-center gap-2 ml-1">
          <input
            type="text"
            placeholder="New category..."
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            className="px-3 py-2 bg-stone-800 text-white text-sm rounded-lg border border-stone-700 focus:outline-none focus:border-amber-500 w-36"
          />
          <button
            onClick={handleAddCategory}
            disabled={addingCat || !newCatName.trim()}
            className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white text-sm rounded-lg transition disabled:opacity-40"
          >
            {addingCat ? '...' : '+ Add'}
          </button>
        </div>
      </div>

      {/* ── Items list ── */}
      {activeCategory ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-stone-500 text-sm">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition"
            >
              + Add Item
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-stone-600 border border-dashed border-stone-800 rounded-xl">
              No items yet. Hit <span className="text-amber-600">+ Add Item</span> to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isDeleting={deletingItemId === item.id}
                  onEdit={() => openEdit(item)}
                  onToggleAvailability={() => handleToggleAvailability(item)}
                  onDeleteRequest={() => setDeletingItemId(item.id)}
                  onDeleteConfirm={() => handleDeleteItem(item.id)}
                  onDeleteCancel={() => setDeletingItemId(null)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-600 border border-dashed border-stone-800 rounded-xl">
          Add a category above to get started.
        </div>
      )}

      {/* ── Add / Edit modal ── */}
      {modal.open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">
              {modal.editing ? 'Edit Item' : 'Add Item'}
            </h2>

            {formError && (
              <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-900/40 px-3 py-2 rounded-lg">
                {formError}
              </p>
            )}

            <div className="space-y-4">
              <Field label="Name *">
                <input
                  type="text"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="e.g. Grilled River Fish"
                  autoFocus
                  className={inputCls}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  rows={2}
                  placeholder="Short description shown on the menu..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <div className="flex gap-3">
                <Field label="Price (LKR)" className="flex-1">
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => updateForm('price', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className={inputCls}
                  />
                </Field>

                <Field label="Category" className="flex-1">
                  <select
                    value={form.category_id}
                    onChange={e => updateForm('category_id', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Image URL">
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => updateForm('image_url', e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="mt-2 w-full h-28 object-cover rounded-lg"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </Field>

              <div className="flex items-center justify-between py-1">
                <span className="text-stone-400 text-sm">Available on menu</span>
                <ToggleSwitch
                  on={form.is_available}
                  onToggle={() => updateForm('is_available', !form.is_available)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={saving}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : modal.editing ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ItemRow({
  item,
  isDeleting,
  onEdit,
  onToggleAvailability,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  item: MenuItem
  isDeleting: boolean
  onEdit: () => void
  onToggleAvailability: () => void
  onDeleteRequest: () => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        item.is_available
          ? 'bg-stone-900 border-stone-800'
          : 'bg-stone-900/40 border-stone-800/40 opacity-60'
      }`}
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{item.name}</p>
        {item.description && (
          <p className="text-stone-400 text-sm truncate mt-0.5">{item.description}</p>
        )}
        {item.price != null && (
          <p className="text-amber-400 text-sm font-medium mt-1">
            LKR {item.price.toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleAvailability}
          title={item.is_available ? 'Mark unavailable' : 'Mark available'}
          className={`text-xs px-2.5 py-1 rounded-full border transition ${
            item.is_available
              ? 'border-green-700 text-green-400 hover:border-red-700 hover:text-red-400 hover:bg-red-900/20'
              : 'border-stone-700 text-stone-500 hover:border-green-700 hover:text-green-400 hover:bg-green-900/20'
          }`}
        >
          {item.is_available ? 'Available' : 'Unavailable'}
        </button>

        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-sm bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition"
        >
          Edit
        </button>

        {isDeleting ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onDeleteConfirm}
              className="px-3 py-1.5 text-sm bg-red-700 hover:bg-red-600 text-white rounded-lg transition"
            >
              Delete
            </button>
            <button
              onClick={onDeleteCancel}
              className="px-3 py-1.5 text-sm bg-stone-800 text-stone-400 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onDeleteRequest}
            className="px-3 py-1.5 text-sm bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 rounded-lg transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-stone-400 text-sm block mb-1">{label}</label>
      {children}
    </div>
  )
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        on ? 'bg-amber-600' : 'bg-stone-700'
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

// ─── Shared Tailwind class ─────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2 bg-stone-800 text-white rounded-lg border border-stone-700 focus:outline-none focus:border-amber-500 transition'