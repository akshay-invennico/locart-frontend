import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchInput = React.forwardRef(
  ({ className, placeholder = "Search here...", ...props }, ref) => {
    return (
      <div className={cn("relative w-full max-w-sm", className)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 outline-none transition-colors focus:border-primary1"
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
