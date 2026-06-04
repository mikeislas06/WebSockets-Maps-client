
export interface Client {
    clientId: string;
    name: string;
    color: string;
    coords: Coords
}

export interface Coords {
    lat: number;
    lng: number
}