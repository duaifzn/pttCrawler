import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import PttService from "../services/pttService.ts"

export default class PttApi extends PttService{
    readonly gossiping: string
    readonly pttOrigin: string
    readonly stock: string
    readonly nba: string
    readonly cChat: string
    readonly baseball: string
    readonly lifeismoney: string
    readonly hatePolitics: string
    readonly creditcard: string

    constructor(){
        super()
        this.pttOrigin = 'https://www.ptt.cc'
        this.gossiping = 'https://www.ptt.cc/bbs/Gossiping/index.html'
        this.stock = 'https://www.ptt.cc/bbs/Stock/index.html'
        this.nba = 'https://www.ptt.cc/bbs/NBA/index.html'
        this.cChat = 'https://www.ptt.cc/bbs/C_Chat/index.html'
        this.baseball = 'https://www.ptt.cc/bbs/Baseball/index.html'
        this.lifeismoney = 'https://www.ptt.cc/bbs/Lifeismoney/index.html'
        this.hatePolitics = 'https://www.ptt.cc/bbs/HatePolitics/index.html'
        this.creditcard = 'https://www.ptt.cc/bbs/creditcard/index.html'

    }

    async getPostUrl(targetUrl: string, pageNumber: number=1){
        if(pageNumber < 1) return
        const requestInit = {
            method: 'GET',
            headers: {
                'cookie': 'over18=1',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        }
        const url = targetUrl
        const res = await fetch(url, requestInit)
        const html = await res.text()
        //get posts from page
        const $ = cheerio.load(html)
        let posts: {title: string, url: string}[] = []
        $('div[class="r-ent"]').each((i, elem) =>{
            posts.push({
                title: $(elem)
                    .find('div[class="title"]')
                    .children('a')
                    .text(),
                url: this.pttOrigin + $(elem)
                    .find('div[class="title"]')
                    .children('a')
                    .attr('href')
            })     
        })

        //write data to db
        for(let post of posts){
            await super.createOrUpdataPost(post)
        }
        //get posts from front page
        let frontPage = $('.btn-group.btn-group-paging > a:nth-child(2)').attr('href')
        await this.getPostUrl(this.pttOrigin+frontPage, --pageNumber)
        return
    }

    async getAllCategoryPostUrl(){
        this.getPostUrl(this.gossiping)
        this.getPostUrl(this.stock)
        this.getPostUrl(this.nba)
        this.getPostUrl(this.cChat)
        this.getPostUrl(this.baseball)
        this.getPostUrl(this.lifeismoney)
        this.getPostUrl(this.hatePolitics)
        this.getPostUrl(this.creditcard)
    }
}

// const pttApi = new PttApi()
// pttApi.getAllCategoryPostUrl()