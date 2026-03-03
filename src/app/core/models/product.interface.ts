export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  urlImage?: string; // Backend uses urlImage, frontend card expects 'image' (we'll map it)
  category: string | { _id: string; name: string }; // Backend can return ID (string) or populated object
  stock: number;
  isActive: boolean;
  material: 'oro' | 'plata' | 'acero' | 'otro';
  purity?: string;
  color?: string;
  weigthGrams: number;
  size?: string;
  gemstone?: string;
  gemstoneCarats?: number;
  certificate?: string;
  certificateNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}
