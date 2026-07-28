"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { GalleryPhoto, GalleryCategory } from "@/lib/types/gallery";

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<GalleryCategory>("outdoor");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPhotos(data as GalleryPhoto[]);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .insert({
          image_url: publicUrlData.publicUrl,
          storage_path: filePath,
          category: category,
        });

      if (dbError) throw dbError;

      setFile(null);
      (document.getElementById("file-upload") as HTMLInputElement).value = "";
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] p-8 text-[#1F2A20]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Manage Gallery Photos</h1>

        <form onSubmit={handleUpload} className="mb-12 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Upload New Photo</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Select Image</label>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp, image/avif"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full rounded-md border p-2 bg-white"
              >
                <option value="outdoor">Outdoor</option>
                <option value="treehouse">Tree House</option>
                <option value="food">Food</option>
                <option value="menu">Menu</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!file || uploading}
              className="rounded-md bg-[#2D3F2B] px-6 py-2 text-white transition hover:bg-[#1F2D21] disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Current Photos</h2>
          {loading ? (
            <p>Loading photos...</p>
          ) : photos.length === 0 ? (
            <p className="text-gray-500">No photos found. Upload some above.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-4/3 overflow-hidden rounded-lg border bg-gray-100">
                  <Image
                    src={photo.image_url}
                    alt={photo.category}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                    <span className="rounded bg-white/90 px-2 py-1 text-xs font-semibold uppercase">
                      {photo.category}
                    </span>
                    <button
                      onClick={() => handleDelete(photo.id, photo.storage_path)}
                      className="rounded bg-red-600 px-3 py-1 text-sm font-bold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}