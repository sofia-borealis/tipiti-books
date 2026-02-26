import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-terracota/30",
  {
    variants: {
      variant: {
        default:
          "bg-terracota text-cream rounded-full hover:bg-terracota-dark hover:shadow-[0_4px_16px_rgba(196,125,90,0.3)] hover:-translate-y-0.5",
        secondary:
          "bg-transparent border-[1.5px] border-terracota text-terracota rounded-full hover:bg-terracota hover:text-cream",
        ghost:
          "hover:bg-cream-dark hover:text-text rounded-lg",
        destructive:
          "bg-terracota-dark text-cream rounded-full hover:bg-terracota-dark/90",
        link: "text-terracota underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-3.5",
        sm: "h-9 px-5 py-2 text-sm",
        lg: "h-14 px-10 py-4 text-lg",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
