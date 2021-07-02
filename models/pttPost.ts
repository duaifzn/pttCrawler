export default interface PttPostSchema {
    _id: {$oid: string};
    title: string;
    url: string; 
    createdAt: Date;
    updatedAt: Date;
}

