import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * MercadoPago webhook handler (IPN)
 * Called when payment status changes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    // TODO: When MercadoPago is configured:
    // 1. GET payment details from MercadoPago API using data.id
    // 2. Verify payment status (approved, rejected, pending)
    // 3. Extract orderId from external_reference
    // 4. Update order in DB

    console.log('[MercadoPago webhook] Received:', { type, paymentId: data?.id })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[MercadoPago webhook] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
