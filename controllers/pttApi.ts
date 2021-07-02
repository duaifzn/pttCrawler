import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import PttService from "../services/pttService.ts"
import { parse } from "https://deno.land/std@0.100.0/datetime/mod.ts";
import { month } from "../helpers/date.ts";
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
            let urlTemp = $(elem)
            .find('div[class="title"]')
            .children('a')
            .attr('href')
            if(!urlTemp) return false
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
        await this.getPostUrl(this.gossiping)
        await this.getPostUrl(this.stock)
        await this.getPostUrl(this.nba)
        await this.getPostUrl(this.cChat)
        await this.getPostUrl(this.baseball)
        await this.getPostUrl(this.lifeismoney)
        await this.getPostUrl(this.hatePolitics)
        await this.getPostUrl(this.creditcard)
    }

    async getPostDetail(targetUrl: string){
        //get
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
        const $ = cheerio.load(html)
        let author = $('#main-content > div:nth-child(1) > span.article-meta-value').text()
        let title = $('#main-content > div:nth-child(3) > span.article-meta-value').text()
        let category = $('#main-content > div.article-metaline-right > span.article-meta-value').text()
        let publishTime = $('#main-content > div:nth-child(4) > span.article-meta-value').text()
        let time = publishTime.split(' ').filter((e) => e.trim().length>0)

        //get comment
        let comments: { 
            reviewer: string,
            review: string,
            reviewTime: Date,
            retweetOrBoo: string | null}[] = [];
        $('div[class="push"]').each((i, elem) =>{
            let timeTemp = $(elem).find('span[class="push-ipdatetime"]').text().trim().split(' ')
            let ip = ''
            let date = ''
            let commentTime = ''
            if(timeTemp.length == 2){
                date = timeTemp[0]
                commentTime = timeTemp[1]
            }
            if(timeTemp.length == 3){
                ip = timeTemp[0]
                date = timeTemp[1]
                commentTime = timeTemp[2]
            }
            comments.push({
                reviewer: $(elem).find('span[class="f3 hl push-userid"]').text(),
                review: $(elem).find('span[class="f3 push-content"]').text(),
                reviewTime: parse(`${time[4]} ${date} ${commentTime}`,'yyyy MM/dd HH:mm'),
                retweetOrBoo: $(elem).find('span[class="hl push-tag"]').text().trim()   
            })
        })
        //get post content
        let content = $('#main-content').children().remove().end().text()
        
        //write data to db
        await super.createPostDetail({
            author: author,
            title: title,
            category: category,
            content: content,
            publishTime: parse(`${month[time[1]]} ${time[2].length == 1?'0'+time[2]: time[2]} ${time[3]} ${time[4]}`, 'MM dd HH:mm:ss yyyy'),
        }, comments)
    }

    async getAllPostDetail(){
        let urls = await super.getAllPostUrl()
        for(let url of urls){
            try{
                await this.getPostDetail(url)
            }catch(err){
                console.error(err)
                console.log(`error on the ${url}`)
                continue
            } 
        }
        
    }
}

// const pttApi = new PttApi()
// //await pttApi.getAllCategoryPostUrl()
// await pttApi.getAllPostDetail()