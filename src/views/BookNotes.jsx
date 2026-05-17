import { useState, useEffect, useMemo } from 'react'
import { getBook, getBooks } from '../data/books'
import useStore from '../store/useStore'
import mermaid from 'mermaid'

function isMermaidBlock(line) {
  return line.startsWith('```mermaid') || line.startsWith('``` Mermaid')
}

function MermaidBlock({ code }) {
  const [svg, setSvg] = useState(null)

  useEffect(() => {
    const id = `m-${Math.random().toString(36).slice(2, 10)}`
    mermaid.render(id, code).then(res => {
      setSvg(res.svg)
    }).catch(() => {
      setSvg(null)
    })
  }, [code])

  if (svg) {
    return <div className="my-6 flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
  }

  return <div className="my-6 flex justify-center"><div className="text-[var(--text-muted)] animate-pulse">Loading chart...</div></div>
}

function renderLine(line, idx) {
  if (line.startsWith('## ')) {
    return <h3 key={idx} className="text-lg font-bold text-[var(--text-primary)] mt-8 mb-4">{line.replace('## ', '')}</h3>
  }
  if (line.startsWith('### ')) {
    return <h4 key={idx} className="text-base font-bold text-[var(--text-primary)] mt-6 mb-3">{line.replace('### ', '')}</h4>
  }
  if (line.startsWith('**') && line.endsWith('**')) {
    return <p key={idx} className="font-bold text-[var(--text-primary)] my-2">{line.replace(/\*\*/g, '')}</p>
  }
  if (line.startsWith('> ')) {
    return <blockquote key={idx} className="border-l-4 border-[var(--text-primary)] pl-4 py-2 my-4 bg-[var(--hover-bg)] rounded-r-lg text-[var(--text-secondary)]">{line.replace('> ', '')}</blockquote>
  }
  if (line.startsWith('- ')) {
    return <li key={idx} className="text-[var(--text-secondary)] ml-4 my-1">{line.replace('- ', '')}</li>
  }
  if (line.startsWith('|')) {
    return null
  }
  if (line.match(/^\d+\./)) {
    return <p key={idx} className="text-[var(--text-secondary)] my-2">{line}</p>
  }
  if (line.startsWith('```')) {
    return null
  }
  if (line.trim()) {
    return <p key={idx} className="text-[var(--text-secondary)] my-3 leading-relaxed">{line}</p>
  }
  return <br key={idx} />
}

function DayContent({ content }) {
  const segments = useMemo(() => {
    const result = []
    const lines = content.split('\n')
    let i = 0
    while (i < lines.length) {
      if (isMermaidBlock(lines[i])) {
        const mermaidLines = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          mermaidLines.push(lines[i])
          i++
        }
        i++
        result.push({ type: 'mermaid', code: mermaidLines.join('\n') })
      } else {
        result.push({ type: 'text', line: lines[i] })
        i++
      }
    }
    return result
  }, [content])

  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.type === 'mermaid') {
          return <MermaidBlock key={idx} code={seg.code} />
        }
        return renderLine(seg.line, idx)
      })}
    </>
  )
}

export default function BookNotes() {
  const [books, setBooks] = useState([])
  const [bookData, setBookData] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('全部')
  const [sortBy, setSortBy] = useState('newest')

  const allTags = useMemo(() => {
    return ['全部', ...Array.from(new Set(books.flatMap(book => book.tags))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))]
  }, [books])

  const filteredBooks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    const result = books.filter(book => {
      const searchable = [book.title, book.description, ...book.tags].join(' ').toLowerCase()
      const matchesKeyword = !keyword || searchable.includes(keyword)
      const matchesTag = activeTag === '全部' || book.tags.includes(activeTag)
      return matchesKeyword && matchesTag
    })

    return [...result].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'zh-Hans-CN')
      if (sortBy === 'length') return b.totalDays - a.totalDays
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [activeTag, books, searchTerm, sortBy])

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    })
  }, [])

  useEffect(() => {
    async function loadBooks() {
      setLoading(true)
      const data = await getBooks()
      setBooks(data)
      setLoading(false)
    }
    loadBooks()
  }, [])

  const handleSelectDay = (day) => {
    setSelectedDay(day)
    setShowQuiz(false)
    setQuizAnswers({})
    setShowResults(false)
  }

  const handleOpenBook = async (bookId) => {
    setLoading(true)
    setBookData(null)
    setSelectedDay(null)
    setShowQuiz(false)
    setQuizAnswers({})
    setShowResults(false)
    const data = await getBook(bookId)
    setBookData(data)
    if (data?.days?.length > 0) {
      setSelectedDay(data.days[0])
    }
    setLoading(false)
  }

  const handleQuizAnswer = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!selectedDay) return 0
    const dayQuiz = selectedDay.quiz || []
    if (dayQuiz.length === 0) return 0
    const correct = dayQuiz.filter((q, idx) => {
      const key = `${selectedDay.day}-${idx}`
      return quizAnswers[key] === q.correct
    }).length
    return Math.round((correct / dayQuiz.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-[var(--text-secondary)]">加载中...</p>
        </div>
      </div>
    )
  }

  // 阅读视图
  if (selectedDay && bookData) {
    const dayQuiz = selectedDay.quiz || []
    const hasQuiz = dayQuiz.length > 0

    return (
      <div className="space-y-6">
        {/* 返回按钮 */}
        <button
          onClick={() => { setSelectedDay(null); setBookData(null); setShowQuiz(false); }}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span>←</span> 返回书籍列表
        </button>

        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{bookData.cover}</span>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{bookData.title}</h1>
              <p className="text-sm text-[var(--text-secondary)]">第{selectedDay.day}章：{selectedDay.title}</p>
            </div>
          </div>
          {hasQuiz && (
            <button
              onClick={() => setShowQuiz(!showQuiz)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${showQuiz
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {showQuiz ? '📖 阅读' : '📝 测试'}
            </button>
          )}
        </div>

        {/* 内容区域 */}
        {showQuiz ? (
          /* 测试视图 */
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                📝 第{selectedDay.day}章 小测试
              </h2>
              <div className="space-y-8">
                {dayQuiz.map((q, idx) => {
                  const key = `${selectedDay.day}-${idx}`
                  const selected = quizAnswers[key]
                  const isCorrect = selected === q.correct
                  return (
                    <div key={q.id} className="space-y-4">
                      <p className="text-base font-medium text-[var(--text-primary)]">
                        <span className="text-[var(--text-muted)] mr-2">{idx + 1}.</span>
                        {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map(opt => {
                          let btnClass = 'bg-[var(--hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                          if (showResults) {
                            if (opt.value === q.correct) {
                              btnClass = 'bg-emerald-500 text-white border-emerald-500'
                            } else if (opt.value === selected && !isCorrect) {
                              btnClass = 'bg-red-500 text-white border-red-500'
                            }
                          } else if (selected === opt.value) {
                            btnClass = 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                          }
                          return (
                            <button
                              key={opt.value}
                              onClick={() => !showResults && handleQuizAnswer(key, opt.value)}
                              disabled={showResults}
                              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${btnClass}`}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                      {showResults && (
                        <div className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                          <p className={`text-sm ${isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
                            <span className="font-bold mr-2">{isCorrect ? '✓' : '💡'}</span>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {!showResults ? (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < dayQuiz.length}
                    className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    提交测试
                  </button>
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">{calculateScore()}%</div>
                  <p className="text-[var(--text-secondary)] mb-4">测试完成</p>
                  {(selectedDay.referenceAnswer || selectedDay.chapterSummary || selectedDay.chapterPrediction) && (
                    <div className="text-left bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-2xl p-5 mb-5 space-y-4">
                      {selectedDay.referenceAnswer && (
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">参考答案</h3>
                          <DayContent content={selectedDay.referenceAnswer} />
                        </div>
                      )}
                      {selectedDay.chapterSummary && (
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">本章总结</h3>
                          <DayContent content={selectedDay.chapterSummary} />
                        </div>
                      )}
                      {selectedDay.chapterPrediction && (
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">本章预测</h3>
                          <DayContent content={selectedDay.chapterPrediction} />
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowQuiz(false)
                      setQuizAnswers({})
                      setShowResults(false)
                    }}
                    className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm font-medium hover:border-[var(--text-primary)] transition-colors"
                  >
                    继续学习
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 阅读视图 */
          <div className="space-y-6">
            {/* 目录导航 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {bookData.days.map(day => (
                <button
                  key={day.id}
                  onClick={() => handleSelectDay(day)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                    ${selectedDay.id === day.id
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent shadow-md'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  第{day.day}章
                </button>
              ))}
            </div>

            {/* 内容 */}
            <article className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedDay.title}</h2>
                <p className="text-[var(--text-secondary)] mb-8">{selectedDay.subtitle}</p>
                <DayContent content={selectedDay.content} />
              </div>
            </article>
          </div>
        )}
      </div>
    )
  }

  // 书籍列表视图
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <section className="text-center pt-8 pb-4">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-3">Book Notes</p>
        <h1 className="text-4xl font-bold mb-3 text-[var(--text-primary)]">读书笔记</h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          沉淀认知，记录成长，把读过的书变成自己的能力
        </p>
      </section>

      {/* 书籍列表 */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
            <input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="搜索书名、简介或标签"
              className="w-full px-4 py-3 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] transition-colors"
            />
            <select
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] transition-colors"
            >
              <option value="newest">按最新排序</option>
              <option value="title">按名称排序</option>
              <option value="length">按内容量排序</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${activeTag === tag
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                    : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredBooks.map(book => (
            <button
              key={book.id}
              onClick={() => handleOpenBook(book.id)}
              className="text-left bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 cursor-pointer hover:border-[var(--text-primary)] hover:shadow-lg transition-all duration-300 w-full"
            >
              <div className="flex items-start gap-5">
                <div className="text-6xl">{book.cover}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{book.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-4">{book.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {book.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[var(--hover-bg)] rounded-full text-xs text-[var(--text-secondary)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-sm text-[var(--text-muted)]">{book.totalDays} 章内容</span>
                      <span className="text-[var(--text-primary)] font-medium">开始阅读 →</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {filteredBooks.length === 0 && (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            没有找到匹配的内容
          </div>
        )}
      </section>
    </div>
  )
}
