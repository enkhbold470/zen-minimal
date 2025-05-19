export interface ImageItem {
  id: number;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Laptop {
  id: number;
  published: boolean;
  title: string;
  description: string;
  specs: string[];
  price: number;
  originalPrice: number;
  discount?: string | null;
  images: ImageItem[];
  videoUrl?: string | null;
  datePublished: Date;
}

export interface EditLaptopPageProps {
  params: {
    id: string
  }
}

export interface CreateLaptopState {
  message?: string;
  errors?: {
    title?: string[];
    description?: string[];
    specs?: string[];
    price?: string[];
    originalPrice?: string[];
    discount?: string[];
    videoUrl?: string[];
    images?: string[];
    database?: string[];
  };
  success: boolean;
}

export interface ImageItem {
  id: number;
  url: string;
  alt?: string | null;
  position: number;
} 
export interface DeleteLaptopButtonProps {
  id: number
}


export interface EditLaptopFormProps {
  laptop: Laptop & {
    images: ImageItem[]
  }
}