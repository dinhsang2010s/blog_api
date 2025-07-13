# Comment API Enhancements

This document outlines the new APIs added to the comment module based on the comment schema features.

## New API Endpoints

### 1. Nested Comments (Replies)

#### GET `/comments/:id/replies`

- **Description**: Get all replies to a specific comment
- **Parameters**:
  - `id` (string): Comment ID
- **Response**: Array of reply comments with user information

#### GET `/comments/post/:postId/with-replies`

- **Description**: Get all comments for a post with their nested replies
- **Parameters**:
  - `postId` (string): Post ID
- **Response**: Array of comments with nested replies included

### 2. User-based Filtering

#### GET `/comments/user/:userId`

- **Description**: Get all comments by a specific user
- **Parameters**:
  - `userId` (string): User ID
- **Response**: Array of comments by the specified user

### 3. Like Management

#### POST `/comments/:id/unlike`

- **Description**: Decrement the like count for a comment
- **Parameters**:
  - `id` (string): Comment ID
- **Response**: Success message

### 4. Statistics and Analytics

#### GET `/comments/post/:postId/statistics`

- **Description**: Get comment statistics for a post
- **Parameters**:
  - `postId` (string): Post ID
- **Response**: Object containing:
  - `totalComments`: Total number of comments
  - `averageRating`: Average rating of all comments
  - `totalLikes`: Total likes across all comments
  - `commentCount`: Same as totalComments

#### GET `/comments/post/:postId/top-rated`

- **Description**: Get top-rated comments for a post
- **Parameters**:
  - `postId` (string): Post ID
  - `limit` (query, optional): Number of comments to return (default: 5)
- **Response**: Array of top-rated comments

## Enhanced Request DTOs

### CreateCommentRequest

Added `parentCommentId` field to support nested comments:

```typescript
{
  postId: string;
  content: string;
  parentCommentId?: string; // New field for replies
  rating?: number;
}
```

## Enhanced Response DTOs

### IComment Interface

Added new fields to support nested comments and user information:

```typescript
{
  id: string;
  postId: string;
  userId: string;
  parentCommentId?: string; // New field
  content: string;
  rating?: number;
  likes: number;
  userName?: string; // New field
  userEmail?: string; // New field
  replies?: IComment[]; // New field for nested replies
  createdAt: Date;
  updatedAt: Date;
}
```

## New Service Methods

### CommentService

1. `getReplies(commentId: string)` - Get replies to a comment
2. `getByUserId(userId: string)` - Get comments by user
3. `getCommentsWithReplies(postId: string)` - Get comments with nested replies
4. `decrementLikes(commentId: string)` - Decrement like count
5. `getCommentStatistics(postId: string)` - Get comment statistics
6. `getTopRatedComments(postId: string, limit?: number)` - Get top-rated comments

## Schema Features Supported

The new APIs fully support all features defined in the comment schema:

- ✅ **postId**: Required field for linking comments to posts
- ✅ **userId**: Required field for linking comments to users
- ✅ **parentCommentId**: Optional field for nested comments (replies)
- ✅ **content**: Required field for comment text
- ✅ **rating**: Optional field with validation (1-5)
- ✅ **likes**: Default field for like counting
- ✅ **Timestamps**: Automatic createdAt and updatedAt fields

## Usage Examples

### Creating a Reply Comment

```bash
POST /comments
{
  "postId": "post123",
  "content": "This is a reply to the main comment",
  "parentCommentId": "comment456"
}
```

### Getting Comments with Replies

```bash
GET /comments/post/post123/with-replies
```

### Getting Comment Statistics

```bash
GET /comments/post/post123/statistics
```

### Getting Top Rated Comments

```bash
GET /comments/post/post123/top-rated?limit=10
```

## Database Queries

The new APIs use MongoDB aggregation pipelines to efficiently:

- Join with user collection for user information
- Filter by various criteria (postId, userId, parentCommentId)
- Sort by different fields (rating, createdAt, likes)
- Calculate statistics using $group operations
- Support pagination and search functionality

All new APIs maintain consistency with existing patterns and include proper Swagger documentation.
