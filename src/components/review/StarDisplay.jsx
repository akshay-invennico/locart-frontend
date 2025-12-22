import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const StarDisplay = ({ rating, max = 5, size = "size-5", className }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
};

export default StarDisplay;