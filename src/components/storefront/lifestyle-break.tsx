import Image from 'next/image'

interface Props {
  imageSrc: string
  alt: string
  heading: string
  subtitle: string
}

export function LifestyleBreak({ imageSrc, alt, heading, subtitle }: Props) {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-6 py-16 max-w-[640px]">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-white italic leading-tight">
          {heading}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/90 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
