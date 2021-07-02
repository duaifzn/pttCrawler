export default interface PttPostCommentSchema {
    _id: {$oid: string};
    postId: string;
    reviewer: string;
    review: string;
    reviewTime: Date;
    retweetOrBoo: string | null;
    createdAt: Date;
    updatedAt: Date;
}