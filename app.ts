import { Application } from "./deps.ts";
import router from "./routes/route.ts"
import PttService from "./schedules/pttSchedule.ts"

const env = Deno.env.toObject();
const app = new Application();
const port = Number(env.PORT) || 8000;
const pttService = new PttService();

app.use(router.routes())




app.addEventListener('listen',({hostname, port, secure}) =>{
    console.log(`server listening on ${secure?'https://':'http://'}${hostname?hostname:'localhost'}:${port}`)
    pttService.runSchedule()
})
app.listen({port: port});

