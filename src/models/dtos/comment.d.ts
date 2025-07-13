export interface IComment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  rating?: number;
  likes: number;
  userName?: string;
  userEmail?: string;
  replies?: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
