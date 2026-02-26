/**
 * New Order Admin Notification Email
 *
 * Sent to Sofi (hola@tipitibooks.com) when a new order is placed.
 */

interface NewOrderAdminProps {
  orderId: string
  buyerName: string
  buyerEmail: string
  childName: string
  bookTitle: string
  amountPaid: number
  shippingCity: string
  shippingRegion: string
}

export function NewOrderAdminEmail({
  orderId,
  buyerName,
  buyerEmail,
  childName,
  bookTitle,
  amountPaid,
  shippingCity,
  shippingRegion,
}: NewOrderAdminProps) {
  const formattedAmount = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amountPaid)

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: 'Segoe UI', sans-serif; background: #FBF7F0; color: #4A3F35; padding: 32px 16px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8DDD0; overflow: hidden;">
    <div style="background: #C47D5A; padding: 24px; text-align: center;">
      <h1 style="color: #FBF7F0; font-size: 24px; margin: 0;">🎉 ¡Nuevo Pedido!</h1>
    </div>
    <div style="padding: 32px 24px;">
      <p>Sofi, tienes un nuevo pedido:</p>

      <div style="background: #FBF7F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px;"><strong>Pedido:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 0 0 8px;"><strong>Libro:</strong> ${bookTitle.replace('{name}', childName)}</p>
        <p style="margin: 0 0 8px;"><strong>Comprador:</strong> ${buyerName} (${buyerEmail})</p>
        <p style="margin: 0 0 8px;"><strong>Monto:</strong> ${formattedAmount}</p>
        <p style="margin: 0;"><strong>Envío:</strong> ${shippingCity}, ${shippingRegion}</p>
      </div>

      <p>Revisa el pedido en el panel admin para preparar el envío.</p>
    </div>
  </div>
</body>
</html>`
}
