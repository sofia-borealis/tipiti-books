import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * PDF Composition API route
 *
 * Triggered after payment confirmation to compose the final print PDF.
 * In production, this is called by Inngest background job.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, books(*), character_variants(*)')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // TODO: When variant pages are generated:
    // 1. Get all variant_pages for order.variant_id
    // 2. Build PDF with buildPrintPDF()
    // 3. Upload to Supabase Storage (print-files bucket)
    // 4. Update order with print_file_url and print_status='ready'

    console.log('[Compose] PDF composition requested for order:', orderId)

    // Update order status
    await supabase
      .from('orders')
      .update({ print_status: 'processing' })
      .eq('id', orderId)

    return NextResponse.json({ status: 'processing', orderId })
  } catch (error) {
    console.error('[Compose] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
