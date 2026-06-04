
export interface Client {
    clientId: string;
    name: string;
    color: string;
    coords: Coords
    updatedAt?: number
}

export interface Coords {
    lat: number;
    lng: number
}