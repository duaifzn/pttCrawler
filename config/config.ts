import { ConnectOptions } from "../deps.ts";

export const config: {
    mongo: ConnectOptions
} = {
    mongo: {
        db: 'rt',
        tls: false,
        servers: [
            {
                host: 'test-mongo',
                port: 27017
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