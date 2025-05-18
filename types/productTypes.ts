export interface ImageItem {
  id: number;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Laptop {
  id: number;
  title: string;
  description: string;
  specs: string[];
  price: number;
  originalPrice: number;
  discount?: string | null;
  images: ImageItem[];
  videoUrl?: string | null;
  datePublished: string;
}
