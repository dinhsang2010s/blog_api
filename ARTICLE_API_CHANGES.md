# Article API Changes

## Overview

API đã được cập nhật để phù hợp với schema mới với các tính năng SEO và social media optimization.

## Schema Changes

### New Fields

- `slug`: URL SEO-friendly (tự động tạo từ title)
- `metaTitle`: Tiêu đề cho Google (tối đa 60 ký tự)
- `metaDescription`: Mô tả cho Google (tối đa 155 ký tự)
- `keywords`: Mảng từ khóa SEO
- `ogTitle`, `ogDescription`, `ogImage`, `ogType`: Open Graph tags
- `structuredData`: JSON-LD schema
- `summary`: Tóm tắt bài viết
- `authorId`: ID của tác giả (thay thế createdBy/updatedBy)
- `tags`: Mảng tags để liên kết bài viết
- `coverImage`, `imageAlt`: Hình ảnh bìa và alt text
- `relatedPosts`: Mảng ID bài viết liên quan
- `views`, `likes`, `averageRating`, `commentCount`: Thống kê tương tác

### Removed Fields

- `description` → `summary`
- `imageTopic` → `coverImage`
- `keyWordSeo` → `keywords`
- `descriptionSeo` → `metaDescription`
- `createdBy`, `updatedBy` → `authorId`

## API Endpoints

### GET /articles

- Tìm kiếm theo title, metaTitle, metaDescription, keywords, tags
- Phân trang và sắp xếp
- Filter theo categoryId

### GET /articles/:id

- Lấy chi tiết bài viết theo ID

### POST /articles

- Tạo bài viết mới
- Tự động tạo slug, metaTitle, metaDescription nếu không cung cấp

### PUT /articles/:id

- Cập nhật bài viết

### DELETE /articles/:id

- Xóa bài viết

### POST /articles/:id/view

- Tăng số lượt xem

### POST /articles/:id/like

- Tăng số lượt thích

### POST /articles/:id/rating

- Cập nhật rating (0-5)

### POST /articles/:id/comment

- Tăng số comment

### GET /articles/:id/related

- Lấy bài viết liên quan (dựa trên category, tags, keywords)

## Request/Response Examples

### Create Article

```json
{
  "title": "Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14",
  "content": "Nội dung chi tiết...",
  "categoryId": "category_id_here",
  "tags": ["technology", "mobile"],
  "coverImage": "https://example.com/image.jpg",
  "imageAlt": "ColorOS 14 features"
}
```

### Response

```json
{
  "id": "article_id",
  "title": "Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14",
  "slug": "toan-bo-thay-doi-va-thoi-gian-cap-nhat-cua-coloros-14",
  "metaTitle": "Toàn bộ thay đổi và thời gian cập nhật của ColorOS 14",
  "metaDescription": "OPPO đã phát hành phiên bản beta của ColorOS 14...",
  "keywords": [],
  "content": "Nội dung chi tiết...",
  "summary": null,
  "authorId": "user_id",
  "authorName": "Author Name",
  "categoryId": "category_id",
  "categoryName": "Technology",
  "tags": ["technology", "mobile"],
  "coverImage": "https://example.com/image.jpg",
  "imageAlt": "ColorOS 14 features",
  "views": 0,
  "likes": 0,
  "averageRating": 0,
  "commentCount": 0,
  "status": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Utility Functions

### createSlug(title: string)

Tạo slug từ title:

- Chuyển thành lowercase
- Loại bỏ ký tự đặc biệt
- Thay khoảng trắng bằng dấu gạch ngang

### generateMetaTitle(title: string)

Tạo meta title tối đa 60 ký tự

### generateMetaDescription(content: string)

Tạo meta description tối đa 155 ký tự từ nội dung

## Auto-generation Features

- Slug được tự động tạo từ title nếu không cung cấp
- MetaTitle được tự động tạo từ title nếu không cung cấp
- MetaDescription được tự động tạo từ content nếu không cung cấp
