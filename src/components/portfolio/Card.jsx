"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function PortfolioCard({ data }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/my-store/portfolio/${data.id}`);
  };
  return (
    <div onClick={handleClick} className="border rounded-xl shadow-sm hover:shadow-md transition p-3 bg-white cursor-pointer">
      <div className="grid grid-cols-2 gap-2 h-40 overflow-hidden rounded-lg">
        {data.images.slice(0, 4).map((img, i) => (
          <img
            key={i}
            src={img || "/noimage.png"}
            alt="album preview"
            className="w-full h-full object-cover rounded-md"
          />
        ))}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-lg">{data.albumName}</h3>
        <p className="text-sm text-gray-500">{data.description}</p>
        <p className="text-sm text-gray-600 mt-1">{data.images.length} Photos</p>
      </div>
    </div>
  );
}
