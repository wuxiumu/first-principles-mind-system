// API 基础 URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

// 获取书籍列表
export async function getBooks() {
  try {
    const res = await fetch(`${API_BASE}?action=books`)
    if (!res.ok) throw new Error('Failed to fetch books')
    return res.json()
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}

// 获取书籍详情（包含所有天数）
export async function getBook(bookId) {
  try {
    const res = await fetch(`${API_BASE}?action=book&id=${bookId}`)
    if (!res.ok) throw new Error('Failed to fetch book')
    return res.json()
  } catch (error) {
    console.error('Error fetching book:', error)
    return null
  }
}

// 获取某一天的内容
export async function getDay(bookId, day) {
  try {
    const res = await fetch(`${API_BASE}?action=day&book_id=${bookId}&day=${day}`)
    if (!res.ok) throw new Error('Failed to fetch day')
    return res.json()
  } catch (error) {
    console.error('Error fetching day:', error)
    return null
  }
}

// 获取简介
export async function getIntro(bookId) {
  try {
    const res = await fetch(`${API_BASE}?action=intro&book_id=${bookId}`)
    if (!res.ok) throw new Error('Failed to fetch intro')
    return res.json()
  } catch (error) {
    console.error('Error fetching intro:', error)
    return { content: '' }
  }
}
