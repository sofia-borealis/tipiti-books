/**
 * Flow.cl payment gateway client wrapper
 *
 * Flow.cl is the primary payment provider for Chile.
 * Supports: credit/debit cards, bank transfers.
 *
 * Environment variables needed:
 * - FLOW_API_KEY
 * - FLOW_SECRET_KEY
 * - FLOW_MERCHANT_ID
 * - FLOW_API_URL (sandbox: https://sandbox.flow.cl/api, production: https://www.flow.cl/api)
 */

const FLOW_API_URL = process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api'

interface CreatePaymentParams {
  orderId: string
  amount: number
  email: string
  subject: string
  urlConfirmation: string
  urlReturn: string
}

export async function createFlowPayment(params: CreatePaymentParams) {
  // TODO: Implement when FLOW_API_KEY is configured
  // 1. Build params object with merchant ID
  // 2. Sign with HMAC-SHA256 using FLOW_SECRET_KEY
  // 3. POST to /payment/create
  // 4. Return redirect URL

  console.log('[Flow.cl] Payment creation not yet configured:', params)
  return {
    url: null,
    token: null,
    error: 'Flow.cl aún no está configurado. Configura FLOW_API_KEY en .env.local',
  }
}

export function verifyFlowSignature(params: Record<string, string>, signature: string): boolean {
  // TODO: Implement HMAC-SHA256 verification
  // 1. Sort params alphabetically
  // 2. Build query string
  // 3. HMAC-SHA256 with FLOW_SECRET_KEY
  // 4. Compare with signature
  return false
}
