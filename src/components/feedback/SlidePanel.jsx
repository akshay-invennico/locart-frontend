import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SlidePanel = ({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
  width = "sm:max-w-[480px]",
}) => {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side={side}
        className={cn(
          "w-full gap-0 bg-white p-6 border-0 shadow-2xl my-2 flex flex-col rounded-2xl",
          width,
          className
        )}
      >
        {(title || description) && (
          <SheetHeader className="px-6 pt-6 pb-4 gap-1">
            {title && (
              <SheetTitle className="text-xl font-bold text-gray-900">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="text-sm text-gray-500">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default SlidePanel;
