import React, { useEffect, useState } from "react";
import PortfolioCard from "@/components/portfolio/Card";
import CreatePortfolio from "@/components/portfolio/CreatePortfolio";
import { getAllPortfolios, createPortfolio, deletePortfolio } from "@/state/portfolio/portfolioService";
import { toast } from "sonner";

const PortfolioPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    const hasImages =
      (formData?.images && Array.isArray(formData.images) && formData.images.length > 0) ||
      (formData?.images instanceof FileList && formData.images.length > 0) ||
      (formData?.images instanceof File) ||
      (formData?.photos && Array.isArray(formData.photos) && formData.photos.length > 0) ||
      (formData?.photos instanceof FileList && formData.photos.length > 0) ||
      (formData?.photos instanceof File);

    if (!hasImages) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);
      const created = await createPortfolio(formData);
      const newAlbum = created?.data ?? created;
      setAlbums((prev) => [newAlbum, ...prev]);
      setIsOpen(false);
    } catch (err) {
      console.error("Create album error", err);
      toast.error(err.message || "Failed to create album");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (album) => {
    const albumId = album?._id ?? album?.id;
    if (!albumId) {
      toast.error("Album ID not found.");
      return;
    }

    try {
      await deletePortfolio(albumId);
      setAlbums((prev) => prev.filter((a) => (a._id ?? a.id) !== albumId));
      toast.success("Album deleted successfully");
    } catch (err) {
      console.error("Delete album error", err);
      toast.error(err.message || "Failed to delete album");
    }
  };

  const handleOpenOptions = (album) => {
    setActiveAlbum(album);
    setShowOptionsModal(true);
  };

  const handleCloseOptions = () => {
    setShowOptionsModal(false);
  };

  const handleOpenConfirm = () => {
    setShowOptionsModal(false);
    setShowConfirmModal(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
    setActiveAlbum(null);
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
              onOpenMenu={handleOpenOptions}
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

      {showOptionsModal && activeAlbum && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleCloseOptions}
        >
          <div
            className="w-[320px] rounded-lg bg-white shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold text-gray-900 mb-3">
              {activeAlbum.name ?? activeAlbum.albumName ?? "Album Options"}
            </div>
            <button
              type="button"
              onClick={handleOpenConfirm}
              className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              Delete Album
            </button>
            <button
              type="button"
              onClick={handleCloseOptions}
              className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && activeAlbum && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleCloseConfirm}
        >
          <div
            className="w-[360px] rounded-lg bg-white shadow-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Delete album?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete the album and its photos. This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCloseConfirm}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleDeleteAlbum(activeAlbum);
                  handleCloseConfirm();
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
