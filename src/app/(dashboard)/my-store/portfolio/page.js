"use client";
import React, { useEffect, useState } from "react";
import PortfolioCard from "@/components/portfolio/Card";
import CreatePortfolio from "@/components/portfolio/CreatePortfolio";
import { getAllPortfolios, createPortfolio } from "@/state/portfolio/portfolioService";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      setFetching(true);
      try {
        const res = await getAllPortfolios();
        const items = res?.data ?? res;
        setAlbums(items?.data ?? items ?? []);
      } catch (err) {
        console.error("Failed to fetch albums", err);
        setAlbums([]);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const handleAddPortfolio = async (formData) => {
    try {
      setLoading(true);
      const created = await createPortfolio(formData);
      const newAlbum = created?.data ?? created ?? created;
      setAlbums((prev) => [newAlbum, ...prev]);
      setIsOpen(false);
    } catch (err) {
      console.error("Create album error", err);
      alert(err.message || "Failed to create album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Portfolio</h2>

        <button
          className="px-4 py-2 bg-primary1 text-white rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          + Add Album
        </button>
      </div>

      {fetching ? (
        <p>Loading albums...</p>
      ) : albums.length === 0 ? (
        <div className="w-full text-center py-20 border rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No portfolio data found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {albums.map((album) => (
            <PortfolioCard
              key={album._id ?? album.id}
              data={{
                id: album._id ?? album.id,
                albumName: album.name ?? album.albumName ?? "Untitled",
                description: album.description ?? "",
                images: album.photos ?? album.images ?? [],
              }}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <CreatePortfolio
          onSubmit={handleAddPortfolio}
          onClose={() => setIsOpen(false)}
          open={isOpen}
        />
      )}

      {loading && <p className="text-primary1 text-center mt-4">Uploading...</p>}
    </div>
  );
}
