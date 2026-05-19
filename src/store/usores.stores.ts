import type { Usor } from "../types";



interface UsoresState {
    perId : Map<string, Usor>
}   



export class UsoresStore {

    private state: UsoresState = {
        perId: new Map(),
    };

    addere(socketId: string, usor: Usor) {
        this.state.perId.set(socketId, usor);
    }

    actualizarePositionem(socketId: string, lng: number, lat: number): boolean {
        const usor = this.state.perId.get(socketId);
        if (!usor) return false;

        usor.lng = lng;
        usor.lat = lat;
        
        return true;
    
    }

}
