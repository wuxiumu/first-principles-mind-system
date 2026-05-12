import { useState, useMemo } from 'react'
import quizCategories from '../data/quiz'
import useStore from '../store/useStore'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts'

function calcScores(answers, quizData) {
  const scores = {}
  quizData.forEach((cat, catIdx) => {
    let total = 0
    let count = 0
    cat.questions.forEach(q => {
      const key = `${catIdx}-${q.id}`
      if (answers[key]) {
        total += answers[key]
        count++
      }
    })
    scores[cat.name] = count > 0 ? Math.round(total / count / 5 * 100) : 0
  })
  return scores
}

export default function SelfQuiz() {
  const store = useStore()
  const [currentCategory, setCurrentCategory] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [completedCategories, setCompletedCategories] = useState(new Set())

  const category = quizCategories[currentCategory]

  function handleAnswer(questionId, value) {
    const key = `${currentCategory}-${questionId}`
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    const scores = calcScores(answers, quizCategories)
    let total = 0
    let count = 0
    Object.values(scores).forEach(v => { total += v; count++ })
    const overall = count > 0 ? Math.round(total / count) : 0

    store.saveQuizResult({ scores, overall })
    const allDone = new Set(quizCategories.map((_, i) => i))
    setCompletedCategories(allDone)
    setShowResults(true)
  }

  function resetQuiz() {
    setCurrentCategory(0)
    setAnswers({})
    setShowResults(false)
    setCompletedCategories(new Set())
  }

  // 雷达图数据
  const radarData = useMemo(() => {
    const history = store.quizHistory
    const lastResult = history[history.length - 1]
    if (!lastResult?.scores) return []
    return Object.entries(lastResult.scores).map(([name, value]) => ({
      subject: name,
      A: value,
      fullMark: 100,
    }))
  }, [store.quizHistory])

  // 历史趋势数据
  const historyData = useMemo(() => {
    return store.quizHistory.map((item, idx) => ({
      name: `第${idx + 1}次`,
      overall: item.overall,
      ...item.scores,
    }))
  }, [store.quizHistory])

  // ===== 结果页面 =====
  if (showResults) {
    const history = store.quizHistory
    const lastResult = history[history.length - 1]
    const resultScores = lastResult?.scores || {}
    const resultOverall = lastResult?.overall || 0

    return (
      <div className="space-y-10">
        {/* 结果标题 */}
        <section className="text-center pt-8 pb-4">
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-3">Assessment Result</p>
          <h1 className="text-4xl font-bold mb-8 text-[var(--text-primary)]">测评结果</h1>
          <div className="text-7xl font-bold bg-gradient-to-r from-[var(--accent-gradient-start)] to-gray-500 bg-clip-text text-transparent">
            {resultOverall}%
          </div>
          <p className="text-[var(--text-secondary)] mt-3">综合成长力评分</p>
        </section>

        {/* 图表区域 */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 雷达图：能力维度 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span>🎯</span> 能力维度分析
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="你的得分"
                  dataKey="A"
                  stroke="#1a1a1a"
                  strokeWidth={3}
                  fill="#1a1a1a"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 柱状图：各维度对比 */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span>📊</span> 各维度得分
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(resultScores).map(([name, value]) => ({ name, value }))}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#1a1a1a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 历史趋势图 */}
        {historyData.length > 1 && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span>📈</span> 成长趋势
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={historyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="overall" name="综合得分" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* 成长建议 */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span>💡</span> 成长建议
            </h3>
            <ul className="space-y-3">
              {Object.entries(resultScores)
                .sort((a, b) => a[1] - b[1])
                .slice(0, 2)
                .map(([name]) => (
                  <li key={name} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <span className="text-emerald-500 mt-0.5">→</span>
                    <span>你的「<span className="font-medium text-[var(--text-primary)]">{name}</span>」维度有待加强，建议从提示面板浏览相关提示</span>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        {/* 重置按钮 */}
        <div className="text-center pt-4 pb-8">
          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            重新测评
          </button>
        </div>
      </div>
    )
  }

  // ===== 测评答题页面 =====
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <section className="text-center pt-8 pb-4">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-3">Self Assessment</p>
        <h1 className="text-4xl font-bold mb-3 text-[var(--text-primary)]">自我测评</h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          通过结构化题目评估你的成长力，诚实作答，无需完美
        </p>
      </section>

      {/* 进度条 */}
      <section className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-300"
              style={{ width: `${((currentCategory + 1) / quizCategories.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--text-muted)] min-w-[48px] text-right">
            {currentCategory + 1} / {quizCategories.length}
          </span>
        </div>
      </section>

      {/* 维度选择器 */}
      <section className="max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2">
          {quizCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${completedCategories.has(idx)
                  ? 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30'
                  : idx === currentCategory
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent shadow-md scale-105'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                }`}
            >
              {completedCategories.has(idx) && <span className="mr-1">✓</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 维度描述 */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 text-center">
          <p className="text-[var(--text-secondary)]">{category.description}</p>
        </div>
      </section>

      {/* 问题列表 */}
      <section className="max-w-2xl mx-auto space-y-4">
        {category.questions.map((q, qIdx) => {
          const key = `${currentCategory}-${q.id}`
          const selected = answers[key]
          return (
            <div key={q.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-4">
                <span className="text-[var(--text-muted)] mr-3 font-bold">{qIdx + 1}.</span>
                {q.text}
              </p>
              <div className="flex gap-2 flex-wrap">
                {q.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all
                      ${selected === opt.value
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md scale-105'
                        : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                      }`}
                  >
                    {opt.value} - {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* 导航按钮 */}
      <section className="max-w-2xl mx-auto pt-4">
        <div className="flex justify-between">
          <button
            disabled={currentCategory === 0}
            onClick={() => setCurrentCategory(c => c - 1)}
            className="px-6 py-3 rounded-full text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← 上一组
          </button>
          {currentCategory < quizCategories.length - 1 ? (
            <button
              onClick={() => setCurrentCategory(c => c + 1)}
              className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              下一组 →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              提交测评
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
