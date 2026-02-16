"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Simplified version if radix is missing, but better to install if we can.
// Actually, let's just make a simple one that proxies props if we don't want to install radix primitive.
// But the imports suggest we might want it.
// Let's check if we can just make a standard HTML label wrapper for now to save time on installs.

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));
Label.displayName = "Label";

export { Label };
