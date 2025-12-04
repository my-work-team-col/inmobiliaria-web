export interface Listing {
    id:            number;
    title:         string;
    slug:          string;
    categories:    Category[];
    isActive:      boolean;
    featured:      boolean;
    gallery:       Gallery[];
    location:      Location;
    city:          City;
    neighborhood:  string;
    code:          string;
    description:   string;
    area:          number;
    bedrooms:      number;
    bathrooms:     number;
    parking:       number;
    price:         number;
    participation: Participation;
    address:       string;
    observations:  string;
}

export enum Category {
    Apartamento = "apartamento",
    Casa = "casa",
    Venta = "venta",
}

export enum City {
    Bogotá = "Bogotá",
}

export enum Gallery {
    ImagesProperty2Jpg = "/images/property-2.jpg",
}

export enum Location {
    BogotáColombia = "Bogotá, Colombia",
}

export enum Participation {
    The100 = "100%",
}
