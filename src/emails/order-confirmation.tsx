/**
 * Order Confirmation Email Template
 *
 * Sent to the buyer after successful payment.
 * Uses React Email format for Resend integration.
 */

interface OrderConfirmationProps {
  buyerName: string
  childName: string
  bookTitle: string
  orderId: string
  amountPaid: number
  shippingAddress: string
}

export function OrderConfirmationEmail({
  buyerName,
  childName,
  bookTitle,
  orderId,
  amountPaid,
  shippingAddress,
}: OrderConfirmationProps) {
  const formattedAmount = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amountPaid)

  // Plain HTML email (compatible with Resend)
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: 'Segoe UI', sans-serif; background: #FBF7F0; color: #4A3F35; padding: 32px 16px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8DDD0; overflow: hidden;">
    <div style="background: #C47D5A; padding: 24px; text-align: center;">
      <h1 style="color: #FBF7F0; font-size: 24px; margin: 0;">¡Pedido confirmado!</h1>
    </div>
    <div style="padding: 32px 24px;">
      <p>Hola ${buyerName},</p>
      <p>Tu pedido de <strong>${bookTitle.replace('{name}', childName)}</strong> ha sido confirmado. Estamos preparando el libro de ${childName} con mucho cariño.</p>

      <div style="background: #FBF7F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px;"><strong>N° Pedido:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 0 0 8px;"><strong>Libro:</strong> ${bookTitle.replace('{name}', childName)}</p>
        <p style="margin: 0 0 8px;"><strong>Total:</strong> ${formattedAmount}</p>
        <p style="margin: 0 0 8px;"><strong>Envío a:</strong> ${shippingAddress}</p>
        <p style="margin: 0;"><strong>Entrega estimada:</strong> 8-12 días hábiles</p>
      </div>

      <p>Te enviaremos un email cuando tu libro sea enviado con el número de seguimiento.</p>
      <p style="color: #8B7E6A; font-size: 14px;">Con cariño,<br>Sofi — Tipiti Books</p>
    </div>
    <div style="background: #FBF7F0; padding: 16px; text-align: center; font-size: 12px; color: #8B7E6A;">
      © 2026 Tipiti Books — Hecho en Chile con amor<br>
      <a href="mailto:hola@tipitibooks.com" style="color: #C47D5A;">hola@tipitibooks.com</a>
    </div>
  </div>
</body>
</html>`
}
