'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: '¿Cuánto demora en llegar mi libro?',
    a: 'El proceso de personalización toma 5-7 días hábiles. El envío dentro de Chile es gratuito y demora 3-5 días hábiles adicionales.',
  },
  {
    q: '¿De qué material es el libro?',
    a: 'Tapa dura con papel interior de 200g, ideal para manos pequeñas. Las ilustraciones se imprimen en alta resolución con colores vibrantes.',
  },
  {
    q: '¿Qué puedo personalizar?',
    a: 'El nombre del protagonista, su apariencia (pelo, piel, ojos) y una dedicatoria personal en la primera página.',
  },
  {
    q: '¿Para qué edad es recomendado?',
    a: 'Diseñado para niños de 2 a 7 años. Las ilustraciones y la historia se adaptan naturalmente a diferentes edades.',
  },
  {
    q: '¿Hacen envíos fuera de Chile?',
    a: 'Por ahora solo enviamos dentro de Chile. Estamos trabajando para habilitar envíos internacionales pronto.',
  },
]

export function BookFAQ() {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base text-ink">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-ink-soft leading-relaxed">{faq.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
