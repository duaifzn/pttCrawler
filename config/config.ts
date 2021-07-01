import { ConnectOptions } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

export const config: {
    mongo: ConnectOptions
} = {
    mongo: {
        db: 'rt',
        tls: false,
        servers: [
            {
                host: 'localhost',
                port: 27018
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