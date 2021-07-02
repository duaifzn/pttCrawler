import PttApi from '../controllers/pttApi.ts'
import { cron } from '../deps.ts';


export default class PttSchedule extends PttApi{
    async runSchedule(){
        cron('1 31 * * * *', async() =>{
            await super.getAllCategoryPostUrl()
            await super.getAllPostDetail()
        })
    }
}