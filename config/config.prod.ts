import { ConnectOptions } from "../deps.ts";

const env = Deno.env.toObject()
export const prod: {
    mongo: ConnectOptions
} = {
    mongo: {
        db: env.MONGO_DBNAME,
        tls: false,
        servers: [
            {
                host: env.MONGO_HOST,
                port: Number(env.MONGO_PORT)
            }
        ],
        credential: {
            username: env.MONGO_USERNAME,
            password: env.MONGO_PASSWORD,
            db: 'admin',
            mechanism: "SCRAM-SHA-1",
        }
    },
}