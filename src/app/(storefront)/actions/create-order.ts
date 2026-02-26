'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const orderSchema = z.object({
  bookId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  childName: z.string().min(2).max(30),
  dedication: z.string().max(200).optional(),
  buyerName: z.string().min(2).max(100),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(8).max(20).optional(),
  shippingAddress: z.string().min(5).max(300),
  shippingCity: z.string().min(2).max(100),
  shippingRegion: z.string().min(2).max(100),
  discountCodeId: z.string().uuid().optional(),
  discountAmount: z.number().min(0).optional(),
  paymentProvider: z.enum(['flow', 'mercadopago']),
  subscribeNewsletter: z.boolean().optional(),
})

export type CreateOrderInput = z.infer<typeof orderSchema>

export async function createOrder(input: CreateOrderInput) {
  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Datos inválidos. Revisa el formulario.' }
  }

  const data = parsed.data
  const supabase = await createClient()

  // Get book price
  const { data: book } = await supabase
    .from('books')
    .select('price_clp')
    .eq('id', data.bookId)
    .single()

  if (!book) {
    return { error: 'Libro no encontrado.' }
  }

  const basePrice = book.price_clp
  const discountAmount = data.discountAmount || 0
  const amountToPay = Math.max(basePrice - discountAmount, 0)

  // Create order in DB
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      book_id: data.bookId,
      variant_id: data.variantId || null,
      child_name: data.childName,
      dedication: data.dedication || null,
      buyer_name: data.buyerName,
      buyer_email: data.buyerEmail,
      buyer_phone: data.buyerPhone || null,
      shipping_address: { address: data.shippingAddress },
      shipping_city: data.shippingCity,
      shipping_region: data.shippingRegion,
      shipping_country: 'CL',
      discount_code_id: data.discountCodeId || null,
      discount_amount: discountAmount,
      amount_paid: amountToPay,
      currency: 'CLP',
      payment_provider: data.paymentProvider,
      payment_status: 'pending',
      status: 'created',
    })
    .select('id')
    .single()

  if (error || !order) {
    console.error('Create order error:', error)
    return { error: 'No se pudo crear el pedido. Intenta nuevamente.' }
  }

  // Subscribe to newsletter if requested
  if (data.subscribeNewsletter) {
    await supabase
      .from('subscribers')
      .upsert(
        { email: data.buyerEmail.toLowerCase(), source: 'checkout', is_active: true },
        { onConflict: 'email' }
      )
  }

  // TODO: Initiate payment with Flow.cl or MercadoPago
  // For now, return order ID — the payment redirect will be handled by the client
  return {
    orderId: order.id,
    amount: amountToPay,
    paymentProvider: data.paymentProvider,
    // paymentUrl will be set when Flow.cl/MercadoPago is configured
  }
}
