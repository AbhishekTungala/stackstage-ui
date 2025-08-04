import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] hover:bg-destructive/90",
        outline:
          "border border-border backdrop-blur-sm shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-[1.02]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:scale-[1.02] hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "backdrop-blur-xl bg-glass border border-glass-border hover:bg-glass-subtle shadow-glass hover:scale-[1.02]",
        hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-premium hover:shadow-glow hover:scale-[1.02] font-semibold",
        premium: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-premium hover:shadow-glow hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700"
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
        hero: "h-16 px-12 text-xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
