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
      alert(`Failed to upload photo: ${error?.message || String(error)}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) return;

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
      alert(`Failed to delete photo: ${error?.message || String(error)}`);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6A5A43] mb-2">Manage</p>
        <h1 className="font-display text-4xl text-[#1F2D21]">Gallery</h1>
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
                ? "border-[#007848] bg-[#E6F0EB]/50"
                : "border-[#CBBDA7] bg-[#FAFAF8] hover:border-[#007848] hover:bg-[#E6F0EB]/30"
            }`}
          >
            <svg className="mb-4 h-10 w-10 text-[#6A5A43] transition-transform group-hover:scale-110 group-hover:text-[#007848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="flex flex-1 flex-col h-full">
              <label className="mb-3 block text-sm font-semibold text-[#1F2D21]">Select or Create a Tag</label>
              
              <div className="mb-4 flex flex-wrap gap-3">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full border px-5 py-2 text-sm font-bold transition-all shadow-sm ${
                      category.toLowerCase() === cat.toLowerCase()
                        ? "border-[#007848] bg-[#007848] text-white"
                        : "border-[#007848] bg-[#E6F0EB]/80 text-[#007848] hover:bg-[#E6F0EB] hover:shadow-md"
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
                  className="w-full rounded-lg border border-[#CBBDA7] bg-white px-4 py-2.5 text-[#1F2D21] focus:border-[#007848] focus:outline-none focus:ring-1 focus:ring-[#007848]"
                />
              </div>

              <div className="mt-auto w-full pt-4">
                <button
                  onClick={handleUpload}
                  disabled={!category.trim() || uploading}
                  className="w-full rounded-full bg-[#007848] px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-[#005C36] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading to Gallery..." : "Upload Photo"}
                </button>
                {!category.trim() && (
                  <p className="mt-2 text-center text-sm text-amber-600">Please provide a tag to continue.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1F2D21]">Live Photos</h2>
          <span className="rounded-full border border-[#007848] bg-[#E6F0EB]/80 px-4 py-1.5 text-xs font-bold text-[#007848]">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:gap-6 lg:grid-cols-4">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-[#E5DFD3] bg-gray-100 shadow-sm"
              >
                <Image
                  src={photo.image_url}
                  alt={photo.category}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className="absolute left-3 top-3 z-10">
                  <span className="rounded-full border border-[#007848] bg-[#E6F0EB]/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#007848] shadow-sm backdrop-blur-sm">
                    {photo.category}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(photo.id, photo.storage_path)}
                  className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 hover:bg-red-700"
                  title="Delete Photo"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}