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
      scenes(count)
    `)
    .order('created_at', { ascending: false })

  // If a book is selected, fetch its variants and scenes for validation
  let variants: Array<{
    id: string
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
    scene_number: number
    base_illustration_url: string | null
  }> = []

  if (selectedBookId) {
    const { data } = await supabase
      .from('character_variants')
      .select(`
        id,
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
      .order('gender')
      .order('skin_tone')
      .order('hair_color')

    variants = (data || []) as typeof variants

    const { data: sceneData } = await supabase
      .from('scenes')
      .select('scene_number, base_illustration_url')
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
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-text font-display mb-1">
        Generación de variantes
      </h1>
      <p className="text-sm text-text-muted mb-6">
        Genera las ilustraciones de cada combinación de personaje via fal.ai
      </p>

      <GenerationDashboard
        books={booksWithCounts}
        variants={variants}
        selectedBookId={selectedBookId || null}
        scenesWithoutIllustration={scenes.filter(s => !s.base_illustration_url).map(s => s.scene_number)}
        variantsWithoutReference={variants.filter(v => !v.reference_image_url).length}
      />
    </div>
  )
}
