export interface Usor{
    id: string;
    nomen: string;
    color: string;
    lng: number;
    lat: number;   
}

export type UsorPayload = Omit<Usor, "id">;

export interface LatLng {
    
    lng: number;
    lat: number;   
}