import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../lib/cn";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("ui-border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "ui-flex ui-flex-1 ui-items-center ui-justify-between ui-py-4 ui-text-sm ui-font-medium ui-transition-all hover:ui-underline [&[data-state=open]_svg]:ui-rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      {/* <Button
        size="icon"
        className="ui-flex ui-items-center ui-justify-center ui-bg-transparent ui-p-1 hover:ui-bg-primary/30"
      >
        <ChevronIcon className="ui-h-8 ui-w-8 ui-rotate-180 ui-text-primary" />
      </Button> */}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:ui-animate-accordion-up data-[state=open]:ui-animate-accordion-down ui-overflow-hidden ui-text-sm"
    {...props}
  >
    <div className={cn("ui-pb-4 ui-pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
