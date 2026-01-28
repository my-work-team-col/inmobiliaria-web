export interface PropertyImage {
    id: string;
    image: string;
    cloudinaryUrl?: string;
    cloudinaryPublicId?: string;
    cloudinaryMetadata?: any;
    propertyId: string;
    isCloudinary?: boolean;
    optimizedUrl?: string;
}

export interface PropertiesWithImages {
    id: string;
    title: string;
    slug: string;
    categories:string[],
    isActive: boolean;
    featured: boolean;
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
    images: PropertyImage[] | null; // Updated to match resolveImage structure
}
