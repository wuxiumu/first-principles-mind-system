import { useState, useMemo } from 'react'
import prompts from '../data/prompts'
import PromptCard from '../components/PromptCard'
import useStore from '../store/useStore'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const categories = ['全部', ...new Set(prompts.map(p => p.category))]
const COLORS = ['#1a1a1a', '#4a4a4a', '#666', '#888', '#aaa']

export default function QuickPrompts() {
  const store = useStore()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [search, setSearch] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const filtered = prompts.filter(p => {
    const matchCategory = activeCategory === '全部' || p.category === activeCategory
    const matchSearch = !search || p.title.includes(search) || p.content.includes(search)
    const matchFav = !showFavoritesOnly || store.favoritePrompts.includes(p.id)
    return matchCategory && matchSearch && matchFav
  })

  // 分类统计图表数据
  const categoryData = useMemo(() => {
    const count = {}
    prompts.forEach(p => {
      count[p.category] = (count[p.category] || 0) + 1
    })
    return Object.entries(count).map(([name, value]) => ({ name, value }))
  }, [])

  // 已读/未读比例
  const readStats = useMemo(() => {
    const readCount = prompts.filter(p => store.readPrompts.includes(p.id)).length
    return [
      { name: '已读', value: readCount },
      { name: '未读', value: prompts.length - readCount },
    ]
  }, [store.readPrompts])

  // 收藏统计
  const favoriteStats = useMemo(() => {
    const favCount = store.favoritePrompts.length
    return [
      { name: '已收藏', value: favCount },
      { name: '未收藏', value: prompts.length - favCount },
    ]
  }, [store.favoritePrompts])

  return (
    <div className="space-y-8">
      {/* ===== 页面标题 ===== */}
      <section className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
          提示面板
        </h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          分类浏览所有思维提示，快速查找你需要的提醒
        </p>
      </section>

      {/* ===== 统计图表区 ===== */}
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 总览卡片 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <p className="text-sm text-[var(--text-muted)] mb-2">提示总数</p>
            <p className="text-4xl font-bold text-[var(--text-primary)]">{prompts.length}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">{categories.length - 1} 个分类</p>
          </div>

          {/* 已读比例饼图 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
            <p className="text-sm text-[var(--text-muted)] mb-2 text-center">已读进度</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={readStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                >
                  {readStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#10b981' : '#e5e2de'}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm font-bold text-emerald-600 mt-1">
              {readStats[0].value} / {prompts.length}
            </p>
          </div>

          {/* 收藏比例饼图 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
            <p className="text-sm text-[var(--text-muted)] mb-2 text-center">收藏进度</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={favoriteStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                >
                  {favoriteStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#f59e0b' : '#e5e2de'}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm font-bold text-amber-600 mt-1">
              {favoriteStats[0].value} / {prompts.length}
            </p>
          </div>
        </div>
      </section>

      {/* ===== 筛选区域 ===== */}
      <section className="max-w-3xl mx-auto space-y-5">
        {/* 搜索框 + 收藏按钮 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索提示内容..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]/10 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border
              ${showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-700 border-amber-500/30 shadow-sm'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
              }`}
          >
            <span className="mr-1.5">★</span>
            收藏 ({store.favoritePrompts.length})
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${activeCategory === cat
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent shadow-md scale-105'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 结果计数 */}
        <p className="text-center text-xs text-[var(--text-muted)]">
          共 {filtered.length} 条提示
        </p>
      </section>

      {/* ===== 提示卡片列表 ===== */}
      {filtered.length > 0 ? (
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(prompt => (
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
        </section>
      ) : (
        <section className="text-center py-20">
          <p className="text-[var(--text-muted)] text-lg">没有找到匹配的提示</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">尝试调整筛选条件</p>
        </section>
      )}
    </div>
  )
}
