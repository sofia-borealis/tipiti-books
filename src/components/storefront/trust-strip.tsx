import { Truck, Award, Heart, ShieldCheck } from 'lucide-react'

const signals = [
  { icon: Truck, label: 'Envío gratis', sublabel: 'A todo Chile' },
  { icon: Award, label: 'Impresión premium', sublabel: 'Tapa dura, papel grueso' },
  { icon: Heart, label: 'Hecho con amor', sublabel: 'Hecho en Chile' },
  { icon: ShieldCheck, label: 'Pago seguro', sublabel: 'Encriptación SSL' },
]

export function TrustStrip() {
  return (
    <section className="bg-white border-y border-rule-light">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map((s) => (
            <div key={s.label} className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-berry/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-berry" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{s.label}</p>
                <p className="text-xs text-ink-soft">{s.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
