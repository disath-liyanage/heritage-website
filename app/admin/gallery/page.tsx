"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  storage_path: string;
  category: string;
  created_at: string;
};

const PRESET_CATEGORIES = ["Cuisine", "Riverside", "Treehouse", "Moments"];

export default function AdminGalleryPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [category, setCategory] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPhotos();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setCategory("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    const finalCategory = category.trim();
    if (!file || !finalCategory) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const safeFolderName = finalCategory.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filePath = `${safeFolderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .insert({
          image_url: publicUrlData.publicUrl,
          storage_path: filePath,
          category: finalCategory,
        });

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      clearSelection();
      fetchPhotos();
    } catch (error: any) {
      const message = error?.message || String(error);
      console.error("Upload Error Details:", message);
      alert(`Failed to upload photo: ${message}`);
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

      if (storageError) throw new Error(`Storage Error: ${storageError.message}`);

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", id);

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      const message = error?.message || String(error);
      console.error("Error deleting photo:", message);
      alert(`Failed to delete photo: ${message}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] p-6 text-[#1F2A20] md:p-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="font-display text-4xl text-[#1F2D21]">Gallery Admin</h1>
          <p className="mt-2 text-[#2A3A2D]/75">Upload and manage photos for the public gallery.</p>
        </header>

        <section className="mb-16 rounded-2xl border border-[#E5DFD3] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#1F2D21]">Add New Photo</h2>
          
          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                isDragging
                  ? "border-[#2D3F2B] bg-[#2D3F2B]/5"
                  : "border-[#CBBDA7] bg-[#FAFAF8] hover:border-[#2D3F2B] hover:bg-[#F5F0E8]"
              }`}
            >
              <svg className="mb-4 h-10 w-10 text-[#6A5A43] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-center font-medium text-[#2A3A2D]">Click to upload or drag and drop</p>
              <p className="mt-1 text-xs text-[#6A5A43]">PNG, JPG, WEBP, or AVIF</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
                accept="image/png, image/jpeg, image/webp, image/avif"
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="relative aspect-4/3 w-full shrink-0 max-w-sm overflow-hidden rounded-xl border border-[#E5DFD3] bg-gray-100">
                <Image src={preview} alt="Upload preview" fill className="object-cover" />
                <button
                  onClick={clearSelection}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-md transition hover:bg-red-600"
                  title="Remove image"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 flex-col">
                <label className="mb-3 block text-sm font-semibold text-[#1F2D21]">Select or Create a Tag</label>
                
                <div className="mb-4 flex flex-wrap gap-3">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                        category.toLowerCase() === cat.toLowerCase()
                          ? "border-[#2D3F2B] bg-[#2D3F2B] text-[#F5F0E8] shadow-md"
                          : "border-[#CBBDA7] bg-[#FFF9F0] text-[#2D3F2B] hover:border-[#2D3F2B]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mb-6 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#6A5A43]">Or type a custom tag:</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="e.g. Events, Specials..."
                    className="w-full rounded-lg border border-[#CBBDA7] bg-white px-4 py-2.5 text-[#1F2D21] focus:border-[#2D3F2B] focus:outline-none focus:ring-1 focus:ring-[#2D3F2B]"
                  />
                </div>

                <div className="mt-auto">
                  <button
                    onClick={handleUpload}
                    disabled={!category.trim() || uploading}
                    className="w-full rounded-lg bg-[#2D3F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#1F2D21] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                  >
                    {uploading ? "Uploading to Gallery..." : "Upload Photo"}
                  </button>
                  {!category.trim() && (
                    <p className="mt-2 text-sm text-amber-600">Please provide a tag to continue.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1F2D21]">Live Photos</h2>
            <span className="rounded-full bg-[#E5DFD3] px-3 py-1 text-xs font-semibold text-[#2A3A2D]">
              {photos.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#CBBDA7]">
              <p className="text-[#6A5A43]">Loading photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#CBBDA7]">
              <p className="text-[#6A5A43]">No photos in the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:gap-6 lg:grid-cols-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-4/3 overflow-hidden rounded-xl border border-[#E5DFD3] bg-gray-100 shadow-sm">
                  <Image
                    src={photo.image_url}
                    alt={photo.category}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1F2A20]/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1F2D21]">
                      {photo.category}
                    </span>
                    <button
                      onClick={() => handleDelete(photo.id, photo.storage_path)}
                      className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}