import { UsoresStore } from '../store/usores.stores';
import type { Usor, UsorPayload } from '../types';





class UsorService {

private usoressStore = new UsoresStore();

addere(socketId: string, payload: UsorPayload): Usor {
  const usor: Usor = {
    id: socketId,
    nomen: payload.nomen,
    color: payload.color,
    lng: payload.lng,
    lat: payload.lat,
  };
  this.usoressStore.addere(socketId, usor);

  return usor;

}

actualizarePositionem(socketId: string, lng: number, lat: number): boolean {
    return this.usoressStore.actualizarePositionem(socketId, lng, lat);
  
}

delere(socketId: string):boolean {
  return this.usoressStore.delere(socketId);
}

obtinere(socketId: string): Usor | undefined {
  return this.usoressStore.obtinere(socketId);
}

obtinereOmnes(): Usor[] {
  return this.usoressStore.obtinereOmnes();
}

obtinereAlios(socketId: string): Usor[] {
  return this.usoressStore.obtinereAlios(socketId);
}


}

export const usorService = new UsorService();