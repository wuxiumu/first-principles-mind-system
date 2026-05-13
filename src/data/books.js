// 书籍元数据（静态）
export const books = [
  {
    id: '7d-mgmt',
    title: '7 天管理高手体系',
    cover: '📚',
    description: '一套写给普通管理者的 7 天实战管理体系，让你从"自己会干"升级为"能带人干成"',
    totalDays: 7,
    tags: ['管理', '实战', '目标'],
    progress: 0,
  },
]

// API 基础 URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

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
