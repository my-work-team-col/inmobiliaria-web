export interface PropertyRow  {
  id: string;
  title: string;
  slug: string;
  categories: string;       // JSON string
  isActive: number;
  featured: number;
  gallery: string | null;   // JSON string
  location: string;
  city: string;
  neighborhood: string;
  code: string;
  description: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  price: number;
  participation: string;
  address: string;
  observations: string;
  images: string | null;    // json_group_array
};
