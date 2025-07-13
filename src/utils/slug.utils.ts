export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng và dấu gạch dưới bằng dấu gạch ngang
    .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
}

export function generateMetaTitle(title: string): string {
  return title.length > 60 ? title.substring(0, 57) + '...' : title;
}

export function generateMetaDescription(
  content: string,
  maxLength: number = 155,
): string {
  // Loại bỏ HTML tags và lấy text thuần
  const plainText = content.replace(/<[^>]*>/g, '');

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength - 3) + '...';
}
