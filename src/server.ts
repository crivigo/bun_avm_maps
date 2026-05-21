import { Server } from "socket.io";
import {Server as Engine} from "@socket.io/bun-engine";
import { SERVER_CONFIG } from "./config/server-config";
import type { LatLng, Usor, UsorPayload } from "./types";
import { usorService } from "./services/usor.service";




const userAdPayload = (cliens: Usor) => {
    return {
        id : cliens.id,
        nomen : cliens.nomen,
        color : cliens.color,
        lng : cliens.lng,
        lat : cliens.lat,
    }
}

export const creareServer = () => {

    const io=new Server({
        //path: SERVER_CONFIG.path,
        //pingTimeout: SERVER_CONFIG.idleTimeout * 1000
    });

    const engine = new Engine({
        path: SERVER_CONFIG.path,
        cors: {
            origin: true,
            credentials: true,
        },
    });

    io.bind(engine);

    io.on("connection", (socket) => {
        console.log(`Cliente conectado (socket.id): ${socket.id}`);

        setTimeout(() => {
            const usores = usorService.obtinereOmnes().map(userAdPayload);
            socket.emit("GET_CLIENTS", usores);
        }, 1000);

        socket.on("CLIENT_REGISTER", (payload: UsorPayload) => {
            const usor = usorService.addere(socket.id, payload);
        
            const usores = usorService.obtinereOmnes().map(userAdPayload);

            socket.emit("GET_CLIENTS", usores);

            socket.broadcast.emit("CLIENT_JOINED", userAdPayload(usor));
        });
       
        socket.on("CLIENT_MOVE", (payload: LatLng) => {
            const ok = usorService.actualizarePositionem(socket.id, payload.lng, payload.lat);

            if (ok) {
                
                socket.broadcast.emit("CLIENT_MOVED", {
                    id: socket.id,
                    lng: payload.lng,
                    lat: payload.lat,   
                } as const);
            }   
        });

        socket.on("CLIENT_DISCONNECTED", () => {
        usorService.delere(socket.id);

        socket.broadcast.emit("CLIENT_LEFT", {
            id: socket.id,
        } as const);

        });
    });

    

    io.on("disconnect", (socket) => {
        console.log(`Cliente desconectado (socket.id): ${socket.id}`);
    });

    const { fetch : engineFetch, websocket} = engine.handler();

    const server = Bun.serve({
        port: SERVER_CONFIG.PORT,
        idleTimeout: SERVER_CONFIG.idleTimeout,
        websocket,
        fetch: (req: Request, server: Parameters<typeof engineFetch>[1]) => {
            const url = new URL(req.url);

            if (url.pathname === SERVER_CONFIG.path as string) {
                return engineFetch(req, server);
            }
            
            return new Response(Bun.file("./public/index.html"), {
                headers: {
                    "Content-Type": "text/html; charset=utf-8"
                }
            });
        }
    });

    return server;
}