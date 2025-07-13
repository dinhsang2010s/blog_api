# Blog API

A NestJS-based REST API for blog management with authentication, user management, articles, categories, and file upload functionality.

## Features

- User authentication and authorization
- Article management (CRUD operations)
- Category management
- File upload functionality
- MongoDB integration
- JWT-based authentication
- Role-based access control

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/blog_api
DB_NAME=blog_api

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
```

### Environment Variables Description

- `DB_URL`: MongoDB connection string (primary)
- `DB_NAME`: Database name
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NODE_ENV`: Application environment

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

🎯 Mục tiêu SEO trong posts collection:
Yếu tố SEO Tác động MongoDB cần gì?
Slug thân thiện URL dễ đọc, dễ chia sẻ Trường slug, unique
Meta title & description Tối ưu hiển thị trên Google Trường riêng biệt
Từ khóa & Tags Hỗ trợ semantic SEO, bài liên quan Trường keywords, tags
Structured Data (Schema.org) Hiển thị rich snippets Có thể sinh từ MongoDB
Ảnh & alt text SEO hình ảnh, mạng xã hội Trường image, imageAlt
Bài viết liên quan Giảm bounce rate Trường relatedPosts
Thống kê tương tác Phân tích chất lượng nội dung views, likes, ratings

✅ Cấu trúc đề xuất: posts Collection (SEO-Optimized)
{
"\_id": ObjectId("..."),

// 👇 URL & Meta
"title": "Đánh giá MacBook Pro M4 Max – Sức mạnh đỉnh cao 2025",
"slug": "danh-gia-macbook-pro-m4-max-2025", // ➤ dùng làm URL
"metaTitle": "Review MacBook Pro M4 Max 2025 | TechBlog.vn", // ➤ title hiển thị trên Google
"metaDescription": "Đánh giá hiệu năng, thiết kế và thời lượng pin của MacBook Pro M4 Max mới nhất năm 2025.",
"keywords": ["MacBook Pro", "Apple M4 Max", "laptop cao cấp", "review laptop"],

// 👇 Nội dung chính
"content": "<h2>Hiệu năng Apple M4 Max</h2><p>...</p>",
"summary": "MacBook Pro M4 Max có hiệu năng vượt trội, pin khủng, phù hợp cho dân sáng tạo nội dung.",

// 👇 Tác giả & Danh mục
"authorId": ObjectId("..."),
"category": "Laptop",
"tags": ["Apple", "Laptop", "MacBook", "2025"],

// 👇 Ảnh
"coverImage": "https://cdn.techblog.vn/macbook.jpg",
"imageAlt": "MacBook Pro M4 Max nhìn từ phía trước",

// 👇 Bài viết liên quan
"relatedPosts": [ ObjectId("..."), ObjectId("...") ],

// 👇 Structured data sẽ sinh tự động từ backend
// frontend sẽ lấy data này render JSON-LD

// 👇 Tương tác
"views": 1204,
"likes": 75,
"averageRating": 4.5, // cache từ `comments`
"commentCount": 24, // cache để giảm truy vấn

// 👇 Thời gian
"createdAt": ISODate("2025-07-10T10:00:00Z"),
"updatedAt": ISODate("2025-07-12T09:30:00Z"),
"publishedAt": ISODate("2025-07-12T09:30:00Z"),

// 👇 Đánh dấu trạng thái
"status": "published" // draft | published | archived
}
🧠 Giải thích chi tiết các trường SEO
Trường Ý nghĩa SEO Mô tả
slug URL SEO-friendly Tạo từ tiêu đề, ví dụ: top-5-laptop-2025
metaTitle Tiêu đề xuất hiện trên Google Giới hạn ~60 ký tự
metaDescription Mô tả ngắn trong kết quả tìm kiếm Giới hạn ~155 ký tự
keywords Hỗ trợ phân tích nội dung Có thể dùng để sinh thẻ meta
tags Liên kết các bài viết liên quan Phục vụ liên kết nội bộ (internal linking)
summary Mô tả ngắn trong trang listing hoặc mạng xã hội Có thể dùng làm Open Graph description
coverImage + imageAlt SEO hình ảnh Rất quan trọng khi chia sẻ
views, likes, ratings Tăng độ tin tưởng Có thể dùng làm yếu tố xếp hạng nội bộ
relatedPosts Giữ người dùng lâu hơn Thể hiện bài viết liên quan ở cuối bài

🔍 Index MongoDB cho SEO (tối ưu truy vấn)
js
Copy
Edit
// Tìm bài theo slug
db.posts.createIndex({ slug: 1 }, { unique: true })

// Truy vấn theo từ khóa hoặc tags
db.posts.createIndex({ tags: 1 })
db.posts.createIndex({ keywords: 1 })

// Bài theo chuyên mục
db.posts.createIndex({ category: 1 })

// Phân trang theo ngày đăng
db.posts.createIndex({ publishedAt: -1 })
