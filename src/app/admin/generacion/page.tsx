import { createAdminClient } from '@/lib/supabase/admin'
import { GenerationDashboard } from '@/components/admin/generation-dashboard'

export default async function GeneracionPage({
  searchParams,
}: {
  searchParams: Promise<{ book?: string }>
}) {
  const { book: selectedBookId } = await searchParams
  const supabase = createAdminClient()

  // Fetch all books with variant counts
  const { data: books } = await supabase
    .from('books')
    .select(`
      id,
      title_template,
      slug,
      total_scenes,
      style_prompt,
      generation_engine,
      customization_prompt,
      scenes(count)
    `)
    .order('created_at', { ascending: false })

  // If a book is selected, fetch its variants and scenes
  let variants: Array<{
    id: string
    label: string | null
    gender: string
    skin_tone: string
    hair_color: string
    hair_type: string
    has_glasses: boolean
    status: string
    reference_image_url: string | null
    variant_pages: { count: number }[]
  }> = []

  let scenes: Array<{
    id: string
    scene_number: number
    base_illustration_url: string | null
  }> = []

  if (selectedBookId) {
    const { data } = await supabase
      .from('character_variants')
      .select(`
        id,
        label,
        gender,
        skin_tone,
        hair_color,
        hair_type,
        has_glasses,
        status,
        reference_image_url,
        variant_pages(count)
      `)
      .eq('book_id', selectedBookId)
      .order('created_at', { ascending: false })

    variants = (data || []) as typeof variants

    const { data: sceneData } = await supabase
      .from('scenes')
      .select('id, scene_number, base_illustration_url')
      .eq('book_id', selectedBookId)
      .order('scene_number')

    scenes = (sceneData || []) as typeof scenes
  }

  const booksWithCounts = (books || []).map(b => ({
    id: b.id,
    title: b.title_template,
    slug: b.slug,
    totalScenes: b.total_scenes || 0,
    sceneCount: (b.scenes as unknown as { count: number }[])?.[0]?.count ?? 0,
    engine: b.generation_engine || 'flux-kontext-pro',
    customizationPrompt: b.customization_prompt || '',
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-text font-display mb-1">
        Generación de ilustraciones
      </h1>
      <p className="text-sm text-text-muted mb-6">
        Genera las ilustraciones personalizadas de cada variante via fal.ai
      </p>

      <GenerationDashboard
        books={booksWithCounts}
        variants={variants}
        scenes={scenes}
        selectedBookId={selectedBookId || null}
      />
    </div>
  )
}
