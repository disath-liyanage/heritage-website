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

type SelectedFile = {
  file: File;
  preview: string;
};

export default function AdminGalleryPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPhotos();
    return () => {
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
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

  const handleFileSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      alert("Please select valid image files.");
      return;
    }
    
    const newSelections = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setSelectedFiles((prev) => [...prev, ...newSelections]);
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
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[indexToRemove].preview);
      updated.splice(indexToRemove, 1);
      return updated;
    });
  };

  const clearSelection = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setTags([]);
    setCustomTag("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = customTag.trim();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setCustomTag("");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || tags.length === 0) return;

    setUploading(true);
    try {
      const finalCategoryString = tags.join(", ");
      
      const uploadPromises = selectedFiles.map(async ({ file }) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const safeFolderName = tags[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
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
            category: finalCategoryString,
          });

        if (dbError) throw new Error(`Database Error: ${dbError.message}`);
      });

      await Promise.all(uploadPromises);

      clearSelection();
      fetchPhotos();
    } catch (error: any) {
      alert(`Failed to upload photos: ${error?.message || String(error)}`);
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
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#6A5A43]">Manage</p>
        <h1 className="font-display text-4xl text-[#1F2D21]">Gallery</h1>
      </header>

      <section className="mb-16 rounded-2xl border border-[#E5DFD3] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1F2D21]">Add New Photos</h2>
          {selectedFiles.length > 0 && (
            <button onClick={clearSelection} className="text-sm font-semibold text-red-600 hover:underline">
              Clear All
            </button>
          )}
        </div>
        
        {selectedFiles.length === 0 ? (
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
            <p className="text-center font-medium text-[#2A3A2D]">Click to upload or drag and drop multiple files</p>
            <p className="mt-1 text-xs text-[#6A5A43]">PNG, JPG, WEBP, or AVIF</p>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) handleFileSelect(e.target.files);
              }}
              accept="image/png, image/jpeg, image/webp, image/avif"
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            
            <div className="w-full shrink-0 max-w-lg">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selectedFiles.map((fileObj, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-[#E5DFD3] bg-gray-100">
                    <Image src={fileObj.preview} alt={`Upload preview ${index}`} fill className="object-cover" />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md transition hover:bg-red-600"
                      title="Remove image"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#CBBDA7] bg-[#FAFAF8] transition hover:border-[#007848] hover:bg-[#E6F0EB]/30"
                >
                  <svg className="h-6 w-6 text-[#6A5A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="mt-2 text-xs font-medium text-[#6A5A43]">Add More</span>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files) handleFileSelect(e.target.files);
                    }}
                    accept="image/png, image/jpeg, image/webp, image/avif"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col h-full">
              <label className="mb-3 block text-sm font-semibold text-[#1F2D21]">Select Tags</label>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleTag(cat)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-all shadow-sm ${
                      tags.includes(cat)
                        ? "border-[#007848] bg-[#007848] text-white"
                        : "border-[#007848] bg-[#E6F0EB]/80 text-[#007848] hover:bg-[#E6F0EB] hover:shadow-md"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mb-6 flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#6A5A43]">Add custom tags (press Enter):</label>
                <input 
                  type="text" 
                  value={customTag} 
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  placeholder="Type tag and press Enter..."
                  className="w-full rounded-lg border border-[#CBBDA7] bg-white px-4 py-2.5 text-[#1F2D21] focus:border-[#007848] focus:outline-none focus:ring-1 focus:ring-[#007848]"
                />
                
                {tags.filter(t => !PRESET_CATEGORIES.includes(t)).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.filter(t => !PRESET_CATEGORIES.includes(t)).map(tag => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                        {tag}
                        <button onClick={() => toggleTag(tag)} className="text-gray-500 hover:text-red-500">
                           <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto w-full pt-4 border-t border-[#E5DFD3]">
                <button
                  onClick={handleUpload}
                  disabled={tags.length === 0 || uploading}
                  className="w-full rounded-full bg-[#007848] px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#005C36] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? `Uploading ${selectedFiles.length} Photo(s)...` : `Upload ${selectedFiles.length} Photo(s)`}
                </button>
                {tags.length === 0 && (
                  <p className="mt-2 text-center text-sm font-medium text-amber-600">Select at least one tag to continue.</p>
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
                
                <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1 max-w-[80%]">
                  {photo.category.split(',').map(cat => (
                    <span key={cat.trim()} className="rounded-full border border-[#007848] bg-[#E6F0EB]/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#007848] shadow-sm backdrop-blur-sm">
                      {cat.trim()}
                    </span>
                  ))}
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