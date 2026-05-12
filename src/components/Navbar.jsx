import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/prompts', label: '提示面板', icon: '💡' },
  { path: '/books', label: '读书笔记', icon: '📚' },
  { path: '/quiz', label: '自我测评', icon: '📋' },
  { path: '/about', label: '关于', icon: 'ℹ️' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo - 居中视觉优化 */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] bg-clip-text text-transparent"
        >
          FPS
        </Link>

        {/* Nav items - 居中排列 */}
        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                  }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Spacer for balance */}
        <div className="w-20" />
      </div>
    </nav>
  )
}
