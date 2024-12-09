export interface ProductImageFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
  sizeInBytes: number
  provider_metadata: {
    public_id: string
    resource_type: string
  }
}

export interface ProductImage {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    large?: ProductImageFormat
    small?: ProductImageFormat
    medium?: ProductImageFormat
    thumbnail?: ProductImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: {
    public_id: string
    resource_type: string
  }
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Product {
  id: number
  documentId: string
  price: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  title: string
  originalPrice: number
  description: string
  specs: string
  images: ProductImage[]
}

export interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface Meta {
  pagination: Pagination
}

export interface ProductResponse {
  data: Product[]
  meta: Meta
}
