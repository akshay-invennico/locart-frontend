"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarDisplay from "@/components/review/StarDisplay";
import ReviewCard from "@/components/review/ReviewCard";
import { getStylistReviews } from "@/state/review/reviewService";
import { useUserContext } from "@/hooks/useUserContext";

const Page = () => {
  const scrollContainerRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?._id) return;

    const fetchReviews = async () => {
      try {
        const data = await getStylistReviews(user?._id);
        setReviews(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user?._id]);

  const ratingSummary = useMemo(() => {
    if (!reviews.length) {
      return {
        average: 0,
        total: 0,
        breakdown: [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: 0 })),
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }));

    return { average, total, breakdown };
  }, [reviews]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 420;

    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const formattedReviews = reviews.map((review) => ({
    id: review._id,
    author: review.customer_id?.name || "Anonymous",
    rating: review.rating,
    date: new Date(review.created_at).toLocaleDateString(),
    content: review.review_text,
    avatar: review.customer_id?.profile_picture || null,
    initials: review.customer_id?.name?.[0] || "U",
    bg: "bg-emerald-600",
  }));

  if (loading) {
    return <p className="text-center text-sm text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">My Reviews & Ratings</CardTitle>
          <CardDescription>
            See how clients feel about your work and track your overall performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start p-4">
            <div className="flex flex-col items-center gap-2 min-w-[200px]">
              <div className="text-6xl font-bold">{ratingSummary.average}/5</div>
              <StarDisplay rating={ratingSummary.average} size="size-8" />
              <p className="text-sm text-gray-500 mt-2">
                Based on {ratingSummary.total} reviews
              </p>
            </div>

            <div className="flex-1 w-full max-w-md space-y-3">
              {ratingSummary.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-24">
                    <StarDisplay rating={item.stars} max={5} size="size-4" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${ratingSummary.total
                          ? (item.count / ratingSummary.total) * 100
                          : 0
                          }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Reviews</CardTitle>
          <CardDescription>
            Explore client feedback on your work and monitor your overall success.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x"
          >
            {formattedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            <div className="w-1 flex-shrink-0" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="icon" onClick={() => scroll("left")}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
