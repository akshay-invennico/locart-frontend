import { Star } from "lucide-react";

const StarRating = ({ value }) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      <span className="text-sm font-medium text-gray-800">{value || 0}/5</span>
    </div>
  );
};

export default StarRating;

