import { ConnectOptions } from "../deps.ts";

export const dev: {
    mongo: ConnectOptions
} = {
    mongo: {
        db: 'rt',
        tls: false,
        servers: [
            {
                host: 'localhost',
                port: 27019
            }
        ],
        credential: {
            username: "eagle",
            password: "eagle-eye",
            db: 'admin',
            mechanism: "SCRAM-SHA-1",
        }
    },
}