import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Flow.cl webhook handler
 * Called when payment status changes (confirmed, rejected, etc.)
 *
 * Flow sends a POST with token parameter.
 * We must verify the HMAC signature and update the order.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get('token') as string

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    // TODO: When Flow.cl is configured:
    // 1. GET /payment/getStatus?token={token} with HMAC signature
    // 2. Verify response signature
    // 3. Extract payment status, orderId, amount
    // 4. Update order in DB

    console.log('[Flow webhook] Received token:', token)

    // For now, return OK to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Flow webhook] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
