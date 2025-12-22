import { api } from "@/lib/api";

export const getStylistReviews = async (userId) => {
  try {
    const response = await api.get(`/review/stylist/reviews/${userId}`);
    return response.data.reviews;
  } catch (error) {
    throw new Error("Failed to fetch stylist reviews");
  }
};

