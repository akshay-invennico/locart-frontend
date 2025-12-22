import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import StarDisplay from "./StarDisplay";
import { Quote } from "lucide-react";

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white border text-card-foreground rounded-xl p-6 w-[400px] flex-shrink-0 flex flex-col justify-between gap-4 h-full relative">
      <div className="relative z-10">
        <p className="text-sm text-gray-500 leading-relaxed font-light">
          {review.content}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-auto relative z-10">
        <Avatar className={cn("size-10 text-white font-medium", review.bg)}>
          <AvatarImage src={review.avatar} />
          <AvatarFallback className={cn("text-white bg-inherit")}>{review.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <StarDisplay rating={review.rating} size="size-3" className="gap-0.5" />
          <span className="text-sm font-semibold text-teal-600">{review.author}</span>
        </div>
        {/* Quote Icon Background Effect */}
        <Quote className="absolute right-0 bottom-0 text-gray-100 fill-gray-100 size-16 transform translate-x-2 translate-y-2 -z-10" />
      </div>
    </div>
  );
};

export default ReviewCard;