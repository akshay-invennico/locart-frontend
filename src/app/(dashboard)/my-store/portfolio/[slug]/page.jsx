"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPortfolioById } from "@/state/portfolio/portfolioService";
import Image from "next/image";

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState({});
  const [fetching, setFetching] = useState(false);

  const handleBack = () => {
    router.push(`/my-store/portfolio`);
  };

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setFetching(true);
      try {
        const res = await getPortfolioById(slug);
        const parsed = res?.data ?? res;
        setData(parsed?.data ?? parsed ?? {});
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
        setData({});
      } finally {
        setFetching(false);
      }
    })();
  }, [slug]);

  const images = data?.photos || [];
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
      <div
          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={handleBack}
        >
          <Image
            src="/icons/backArrow.svg"
            alt="back button"
            width={20}
            height={20}
          />
        </div>
        <h2 className="text-xl font-semibold">{data?.name || "Album"}</h2>
      </div>

      {fetching ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-sm overflow-hidden border">
              <img
                src={img}
                alt="image"
                className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;