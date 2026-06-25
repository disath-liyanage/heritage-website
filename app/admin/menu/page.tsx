import { createClient } from '@/lib/supabase/server'
import MenuEditor from '@/components/admin/MenuEditor'

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('menu_categories').select('*').order('display_order'),
    supabase.from('menu_items').select('*').order('display_order'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>
      <MenuEditor
        initialCategories={categories ?? []}
        initialItems={items ?? []}
      />
    </div>
  )
}