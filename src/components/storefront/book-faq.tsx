'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: '¿Cómo funciona la personalización?',
    a: 'Eliges el nombre del niño/a, su apariencia (color de piel, pelo, lentes) y escribes una dedicatoria. Nosotros generamos las ilustraciones con esa combinación exacta.',
  },
  {
    q: '¿Cuánto demora en llegar?',
    a: 'El libro se imprime y envía en 8-12 días hábiles a todo Chile. Recibirás un email con tu número de seguimiento.',
  },
  {
    q: '¿Puedo ver el libro antes de comprarlo?',
    a: '¡Sí! Después de personalizar verás un preview animado con todas las páginas y el nombre de tu hijo/a.',
  },
  {
    q: '¿Qué calidad tiene la impresión?',
    a: 'Impresión premium en papel grueso de alta calidad, con tapa dura. Las ilustraciones son acuarela digital de nivel editorial.',
  },
  {
    q: '¿Puedo pedir más de un libro?',
    a: 'Actualmente es un libro por pedido. Si necesitas varios, puedes hacer pedidos separados con distintas personalizaciones.',
  },
]

export function BookFAQ() {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-text-light leading-relaxed">{faq.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
