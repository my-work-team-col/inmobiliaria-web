export interface PropertiesWithImages {
    id: string;
    title: string;
    slug: string;
    categories:string[],
    isActive: number;
    featured: number;
    location: string;
    city: string;
    neighborhood: string;
    code: string;
    description: string;
    area: number;
    bedrooms: number;
    bathrooms: 4;
    parking: number;
    price: number;
    participation: string;
    address: string;
    observations: string;
    images: string[] | null;
}
