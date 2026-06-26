import { createClient } from '@/lib/supabase/server'
import MenuManager from '@/components/admin/MenuManager'

export default async function AdminMenuPage() {
  const supabase = await createClient()
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('menu_categories').select('*').order('display_order'),
    supabase.from('menu_items').select('*').order('display_order'),
  ])
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43] mb-2">Manage</p>
      <h1 className="font-display text-4xl text-[#1F2D21] mb-8">Menu</h1>
      <MenuManager initialCategories={categories ?? []} initialItems={items ?? []} />
    </div>
  )
}