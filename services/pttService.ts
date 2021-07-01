import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import PttPostSchema from "../models/pttPost.ts"
import { config } from "../config/config.ts"

const client = new MongoClient();
await client.connect(config.mongo)
const db = client.database("rt")
const PttPost = db.collection<PttPostSchema>("pttPost")

export default class PttService{
    PttPost
    constructor(){
        this.PttPost = PttPost 
    }

    async createOrUpdataPost(post: {
        title: string,
        url: string
    }){
        let data = await PttPost.findOne({url: post.url})
        if(!data){
            await PttPost.insertOne({
                title: post.title,
                url: post.url,
            })
        }
    }
    
}