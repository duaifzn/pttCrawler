import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import PttPostSchema from "../models/pttPost.ts"
import PttPostContentSchema from "../models/pttPostContent.ts"
import PttPostCommentSchema from "../models/pttPostComment.ts"
import { config } from "../config/config.ts"

const client = new MongoClient();
await client.connect(config.mongo)
const db = client.database(config.mongo.db)
const PttPost = db.collection<PttPostSchema>("pttPost")
const PttPostContent = db.collection<PttPostContentSchema>("pttPostContent")
const PttPostComment = db.collection<PttPostCommentSchema>("pttPostComment")
export default class PttService{
    PttPost
    PttPostContent
    PttPostComment
    constructor(){
        this.PttPost = PttPost 
        this.PttPostContent = PttPostContent
        this.PttPostComment = PttPostComment
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
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }
    }
    
    async getAllPostUrl(){
        let data = await this.PttPost.find({})
        return data.map(d => d.url)
    }

    async createPostContent(postContent: {
        author: string;
        title: string;
        category: string;
        content: string;
        publishTime: Date;
    }){
        try{
            let data = await this.PttPostContent.findOne({
                author: postContent.author,
                title: postContent.title,
                category: postContent.category
            })
            
            if(!data){
                let id = await this.PttPostContent.insertOne({
                    author: postContent.author,
                    title: postContent.title,
                    category: postContent.category,
                    content: postContent.content,
                    publishTime: postContent.publishTime,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                return [id, null]
            }else{
                return [data._id, null]
            }
        }catch(err){
            return [null, err]
        }
    }

    async createPostComment(postComment:{
            postId: string;
            reviewer: string;
            review: string;
            reviewTime: Date;
            retweetOrBoo: string | null;
        }){
            let data = await this.PttPostComment.findOne({
                postId: postComment.postId,
                reviewer: postComment.reviewer,
                review: postComment.review,
            })
            if(!data){
                await this.PttPostComment.insertOne({
                    postId: postComment.postId,
                    reviewer: postComment.reviewer,
                    review: postComment.review,
                    reviewTime: postComment.reviewTime,
                    retweetOrBoo: postComment.retweetOrBoo?postComment.retweetOrBoo:null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            }    
    }

    async createPostDetail(postContent: {
        author: string;
        title: string;
        category: string;
        content: string;
        publishTime: Date;
    }, postComments:{
        reviewer: string;
        review: string;
        reviewTime: Date;
        retweetOrBoo: string | null;
    }[],){
        const [postId, err] = await this.createPostContent(postContent)
        if(err){
            console.error(err)
            return
        }
        for(let postComment of postComments){
            await this.createPostComment({postId: postId, ...postComment})
        }
    }
}