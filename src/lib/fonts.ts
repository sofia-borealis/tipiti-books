import { Fraunces, DM_Sans, Caveat } from 'next/font/google'

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
