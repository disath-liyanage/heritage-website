export type GalleryCategory = "outdoor" | "treehouse" | "food" | "menu";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  storage_path: string;
  category: string;
  created_at: string;
};