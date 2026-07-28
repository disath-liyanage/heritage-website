export type GalleryCategory = "outdoor" | "treehouse" | "food" | "menu";

export type GalleryPhoto = {
  id: string;
  image_url: string;
  storage_path: string;
  category: GalleryCategory;
  created_at: string;
};