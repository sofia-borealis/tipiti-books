import { Paintbrush, Cpu, Heart, User, MapPin } from 'lucide-react'

const values = [
  {
    icon: Paintbrush,
    title: 'Pintado a mano',
    description: 'Ilustraciones acuarela originales por artista profesional.',
  },
  {
    icon: Cpu,
    title: 'Personalizado con IA',
    description: 'Tecnología que adapta cada página a tu hijo.',
  },
  {
    icon: Heart,
    title: 'Hecho con cariño',
    description: 'Calidad premium en cada detalle, del papel a la tapa.',
  },
  {
    icon: User,
    title: 'Fundadora creadora',
    description: 'Creado por una mamá, para mamás y papás como tú.',
  },
  {
    icon: MapPin,
    title: 'Hecho en Chile',
    description: 'Diseñado, impreso y enviado desde Chile.',
  },
]

export function BrandValues() {
  return (
    <section className="bg-[#FAFAF8] border-y border-rule-light">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-berry/10 flex items-center justify-center">
                <v.icon className="w-5 h-5 text-berry" strokeWidth={1.4} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink">{v.title}</h3>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
