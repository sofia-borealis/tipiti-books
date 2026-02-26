import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-text-muted h-12 w-full min-w-0 rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-base text-text transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-terracota focus-visible:ring-[3px] focus-visible:ring-terracota/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
