import PttApi from '../controllers/pttApi.ts'
import {cron, daily, monthly, weekly} from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts';


export default class PttSchedule extends PttApi{
    async runSchedule(){
        cron('1 31 * * * *', async() =>{
            await super.getAllCategoryPostUrl()
            await super.getAllPostDetail()
        })
    }
}