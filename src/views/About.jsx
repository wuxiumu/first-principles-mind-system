import { useMemo } from 'react'
import useStore from '../store/useStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts'

const techStack = [
  { name: 'React', desc: 'UI 框架' },
  { name: 'Vite', desc: '构建工具' },
  { name: 'TailwindCSS', desc: '样式引擎' },
  { name: 'Zustand', desc: '状态管理' },
  { name: 'React Router', desc: '路由管理' },
  { name: 'LocalStorage', desc: '本地存储' },
]

const futurePlans = [
  '增加更多测评维度和题库',
  '目标管理与拆解功能（核心）',
  '感悟日志系统',
  '7 天管理高手知识体系',
  '数据可视化（雷达图、趋势图）',
  'PWA 离线支持',
]

export default function About() {
  const store = useStore()

  // 测评历史数据
  const historyData = useMemo(() => {
    return store.quizHistory.map((item, idx) => ({
      name: `第${idx + 1}次`,
      overall: item.overall,
      ...item.scores,
    }))
  }, [store.quizHistory])

  // 最新测评数据
  const latestScores = useMemo(() => {
    const last = store.quizHistory[store.quizHistory.length - 1]
    if (!last?.scores) return []
    return Object.entries(last.scores).map(([name, value]) => ({ name, value }))
  }, [store.quizHistory])

  return (
    <div className="space-y-10">
      {/* 页面标题 */}
      <section className="text-center pt-8 pb-4">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-3">About Project</p>
        <h1 className="text-4xl font-bold mb-3 text-[var(--text-primary)]">关于这个项目</h1>
      </section>

      {/* 初心 */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-5 text-[var(--text-primary)] flex items-center gap-2">
            <span>💭</span> 为什么做这个项目？
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              我过去做事混乱、盲目忙碌、被情绪裹挟。后来明白：
              <span className="text-[var(--text-primary)] font-medium">人最大的能力，不是努力，而是结构化思考。</span>
            </p>
            <p>
              学习管理、学习第一性原理，不是为了高深理论，而是为了：
              把混乱的事变清晰，把复杂的事变简单，把模糊的目标变可执行。
            </p>
            <p>
              本项目不只是前端作品，更是我个人思维的沉淀容器。我用代码固化我的思考，
              用页面记录我的成长，用逻辑约束我的行为。
            </p>
            <p className="text-[var(--text-muted)] italic border-l-4 border-[var(--text-primary)] pl-4 py-1 bg-[var(--hover-bg)] rounded-r-lg">
              代码可以迭代，思维永远进化。
            </p>
          </div>
        </div>
      </section>

      {/* 底层逻辑 */}
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center justify-center gap-2">
            <span>⚡</span> 四大底层逻辑
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">所有决策和行动的指导思想</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { num: '01', title: '拆解', desc: '剥离表象，回归本质' },
            { num: '02', title: '简化', desc: '剔除情绪，只留逻辑' },
            { num: '03', title: '执行', desc: '完成比完美重要' },
            { num: '04', title: '复盘', desc: '经历 + 反思 = 成长' },
          ].map(item => (
            <div
              key={item.num}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 text-center hover:border-[var(--text-primary)] hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl font-bold text-[var(--text-muted)] mb-3 opacity-50">{item.num}</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用数据图表 */}
      {historyData.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2">
              <span>📊</span> 我的成长数据
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 综合得分趋势 */}
              <div>
                <h3 className="font-bold text-[var(--text-secondary)] mb-4 text-sm">综合得分趋势</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="overall" name="综合得分" stroke="#1a1a1a" strokeWidth={2} dot={{ fill: '#1a1a1a' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 最新测评各维度 */}
              <div>
                <h3 className="font-bold text-[var(--text-secondary)] mb-4 text-sm">最新测评维度分析</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={latestScores}>
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 技术栈 */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2">
            <span>🛠️</span> 技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map(tech => (
              <div
                key={tech.name}
                className="bg-[var(--hover-bg)] rounded-xl p-4 text-center border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-colors"
              >
                <p className="font-bold text-[var(--text-primary)]">{tech.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 未来计划 */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2">
            <span>🚀</span> 未来计划
          </h2>
          <div className="space-y-3">
            {futurePlans.map((plan, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--hover-bg)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                  {idx + 1}
                </div>
                <span className="text-[var(--text-secondary)]">{plan}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 结语 */}
      <section className="text-center pt-6 pb-10">
        <p className="text-[var(--text-secondary)] italic max-w-md mx-auto leading-relaxed">
          "不求速成，但求沉淀；不求繁多，但求通透。"
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          — FirstPrinciples-MindSystem
        </p>
      </section>
    </div>
  )
}
