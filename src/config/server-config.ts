export const SERVER_CONFIG = {
    PORT: Number(process.env.PORT) || 3200,
    idleTimeout: 30,
    path: "/socket.io/",
}