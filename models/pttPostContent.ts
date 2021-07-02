export default interface PttPostContentSchema {
    _id: {$oid: string};
    author: string;
    title: string;
    category: string;
    content: string;
    publishTime: Date;
    createdAt: Date;
    updatedAt: Date;
}