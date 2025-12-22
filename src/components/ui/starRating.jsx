// import { Star } from "lucide-react";

// const StarRating = ({ value }) => {
//   const stars = Math.round(value); // round to nearest integer
//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           className={`w-4 h-4 ${
//             i < stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
//           }`}
//         />
//       ))}
//       <span className="ml-1 text-sm text-gray-600">{value}/5</span>
//     </div>
//   );
// };

// export default StarRating;

// components/StarRating.jsx
import { Star } from "lucide-react";

const StarRating = ({ value }) => {
  const stars = Math.round(value); // round if needed
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      <span className="text-sm font-medium text-gray-800">{value}/5</span>
    </div>
  );
};

export default StarRating;

