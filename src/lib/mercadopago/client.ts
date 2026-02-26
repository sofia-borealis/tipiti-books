/**
 * MercadoPago payment gateway client wrapper
 *
 * MercadoPago is the secondary/fallback payment provider.
 * Supports: credit/debit cards, bank transfers, cash payments.
 *
 * Environment variables needed:
 * - MERCADOPAGO_ACCESS_TOKEN
 * - MERCADOPAGO_PUBLIC_KEY
 */

interface CreatePreferenceParams {
  orderId: string
  amount: number
  title: string
  email: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  notificationUrl: string
}

export async function createMercadoPagoPreference(params: CreatePreferenceParams) {
  // TODO: Implement when MERCADOPAGO_ACCESS_TOKEN is configured
  // 1. Build preference object
  // 2. POST to MercadoPago API
  // 3. Return checkout URL

  console.log('[MercadoPago] Preference creation not yet configured:', params)
  return {
    url: null,
    preferenceId: null,
    error: 'MercadoPago aún no está configurado. Configura MERCADOPAGO_ACCESS_TOKEN en .env.local',
  }
}
