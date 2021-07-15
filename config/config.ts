import { dev } from './config.dev.ts'
import { prod } from './config.prod.ts'

export const config = function(){
    if(Deno.env.get('DENO_ENV') == 'prod' || Deno.env.get('DENO_ENV') == 'production'){
        return prod
    }
    else if(Deno.env.get('DENO_ENV') == 'dev' || Deno.env.get('DENO_ENV') == 'development'){
        return dev
    }else{
        return dev
    }
}()



