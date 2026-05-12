import { useEffect, useState, useMemo } from 'react'
import prompts from '../data/prompts'
import PromptCard from '../components/PromptCard'
import useStore from '../store/useStore'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const axioms = [
  '结果 = 目标 × 行动 × 时间',
  '复杂问题 = 最小单元拆解',
  '个人成长 = 刻意练习 + 高频复盘',
]

const COLORS = ['#1a1a1a', '#666', '#999']

export default function Home() {
  const store = useStore()
  const [todayPrompts, setTodayPrompts] = useState([])

  useEffect(() => {
    store.init()
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const shuffled = [...prompts].sort((a, b) => {
      const ha = ((seed + a.id.charCodeAt(0)) * 2654435761) % 4294967296
      const hb = ((seed + b.id.charCodeAt(0)) * 2654435761) % 4294967296
      return ha - hb
    })
    setTodayPrompts(shuffled.slice(0, 3))
  }, [])

  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`

  // 图表数据
  const readCount = store.readPrompts.filter(id => todayPrompts.some(p => p.id === id)).length
  const unreadCount = 3 - readCount

  const progressData = useMemo(() => [
    { name: '已读', value: readCount },
    { name: '未读', value: unreadCount },
  ], [readCount, unreadCount])

  const categoryData = useMemo(() => {
    const categoryCount = {}
    prompts.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
  }, [])

  return (
    <div className="space-y-12">
      {/* ===== Hero 区域 ===== */}
      <section className="text-center pt-8 pb-4">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">
          First Principles · Mind System
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[var(--accent-gradient-start)] via-gray-600 to-gray-400 bg-clip-text text-transparent">
          第一性原理 · 自我成长
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          剥离表象，回归本质。<br />
          用结构化思维，把复杂变简单，把模糊变可执行。
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-4">{dateStr}</p>
      </section>

      {/* ===== 今日提示 + 图表 ===== */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：今日提示卡片 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 模块标题 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-2xl">🌅</span>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">今日提示</h2>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">每天 3 条精选思维提醒</p>
              </div>
            </div>

            {/* 提示卡片 */}
            <div className="grid grid-cols-1 gap-4">
              {todayPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isRead={store.readPrompts.includes(prompt.id)}
                  isFavorite={store.favoritePrompts.includes(prompt.id)}
                  onToggleRead={store.markRead}
                  onToggleFavorite={store.toggleFavorite}
                />
              ))}
            </div>
          </div>

          {/* 右侧：图表区 */}
          <div className="space-y-6">
            {/* 今日进度环形图 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">今日进度</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={4}
                  >
                    {progressData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#10b981' : '#e5e2de'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-[var(--text-secondary)]">已读 ({readCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--border-color)]" />
                  <span className="text-sm text-[var(--text-secondary)]">未读 ({unreadCount})</span>
                </div>
              </div>
            </div>

            {/* 分类统计柱状图 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">提示分类</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={70}
                    tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" fill="#1a1a1a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 三条公理 模块 ===== */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">三条底层公理</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">所有决策的底层判断标准</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {axioms.map((axiom, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 text-center hover:border-[var(--text-primary)] transition-colors duration-300"
            >
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[var(--hover-bg)] flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--text-primary)]">{idx + 1}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{axiom}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 快捷入口 模块 ===== */}
      <section className="text-center pt-4 pb-8">
        <p className="text-[var(--text-secondary)] mb-6">
          探索更多思维工具，或开始自我测评
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/prompts"
            className="px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:shadow-lg transition-all duration-300"
          >
            ← 浏览提示面板
          </a>
          <a
            href="/quiz"
            className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            开始测评 →
          </a>
        </div>
      </section>
    </div>
  )
}
