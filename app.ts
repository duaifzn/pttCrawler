import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import router from "./routes/route.ts"

const env = Deno.env.toObject();
const app = new Application();
const port = Number(env.PORT) || 8000;

app.use(router.routes())




app.addEventListener('listen',({hostname, port, secure}) =>{
    console.log(`server listening on ${secure?'https://':'http://'}${hostname?hostname:'localhost'}:${port}`)
})
app.listen({port: port});

