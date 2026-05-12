import { useState, useEffect, useMemo } from 'react'
import { books, getBook } from '../data/books'
import useStore from '../store/useStore'
import mermaid from 'mermaid'

// 选择题数据（暂时硬编码，后续可从 API 获取）
const quizData = {
  '7d-mgmt-day-1': [
    {
      id: 'd1-q1',
      question: '管理的本质是什么？',
      options: [
        { label: '管人，让员工听话', value: 1 },
        { label: '开会安排任务', value: 2 },
        { label: '让一群人围绕同一个目标，持续、稳定、低内耗地产出结果', value: 3 },
        { label: '考核和激励', value: 4 },
      ],
      correct: 3,
      explanation: '管理的本质是让一群人围绕同一个目标，持续、稳定、低内耗地产出结果，而不是管人或开会。',
    },
    {
      id: 'd1-q2',
      question: '为什么团队很忙但结果不好？',
      options: [
        { label: '员工不够努力', value: 1 },
        { label: '没有设计，团队默认走向混乱', value: 2 },
        { label: '管理者盯得不够紧', value: 3 },
        { label: '资源不够', value: 4 },
      ],
      correct: 2,
      explanation: '忙不等于有效。没有设计（目标/路径/标准/节奏/反馈），团队默认会走向混乱。',
    },
  ],
  '7d-mgmt-day-2': [
    {
      id: 'd2-q1',
      question: '以下哪个是可验收的目标？',
      options: [
        { label: '提升效率', value: 1 },
        { label: '优化用户体验', value: 2 },
        { label: '本周完成 3 个核心页面上线', value: 3 },
        { label: '做好增长', value: 4 },
      ],
      correct: 3,
      explanation: '"本周完成 3 个核心页面上线"有明确的交付物和截止时间，是可验收的目标。',
    },
    {
      id: 'd2-q2',
      question: '目标应该具备什么特点？',
      options: [
        { label: '有挑战性', value: 1 },
        { label: '清楚、可衡量、有截止时间', value: 2 },
        { label: '让团队兴奋', value: 3 },
        { label: '老板认可', value: 4 },
      ],
      correct: 2,
      explanation: '目标要具备三个特点：清楚、可衡量、有截止时间。',
    },
  ],
  '7d-mgmt-day-3': [
    {
      id: 'd3-q1',
      question: '任务拆解时，每个任务不需要包含什么？',
      options: [
        { label: '唯一负责人', value: 1 },
        { label: '明确的交付物', value: 2 },
        { label: '参与人员名单', value: 3 },
        { label: '截止时间和验收标准', value: 4 },
      ],
      correct: 3,
      explanation: '任务需要唯一负责人，而不是参与人员名单。多人参与容易导致责任不清。',
    },
    {
      id: 'd3-q2',
      question: '"大家都参与，但没人负责"会导致什么？',
      options: [
        { label: '效率更高', value: 1 },
        { label: '团队更和谐', value: 2 },
        { label: '烂账', value: 3 },
        { label: '更好的协作', value: 4 },
      ],
      correct: 3,
      explanation: '凡是没有负责人的任务，最后都会变成烂账。',
    },
  ],
  '7d-mgmt-day-4': [
    {
      id: 'd4-q1',
      question: '管理中最可怕的一句话是什么？',
      options: [
        { label: '这个需求做不了', value: 1 },
        { label: '差不多了', value: 2 },
        { label: '我需要帮助', value: 3 },
        { label: '这个要延期', value: 4 },
      ],
      correct: 2,
      explanation: '"差不多了"是最可怕的一句话，没有标准，就没有管理，只有感觉。',
    },
    {
      id: 'd4-q2',
      question: '标准的目的是什么？',
      options: [
        { label: '让团队更累', value: 1 },
        { label: '展示管理者的权威', value: 2 },
        { label: '减少扯皮和返工，让交付更可控', value: 3 },
        { label: '增加工作量', value: 4 },
      ],
      correct: 3,
      explanation: '标准的目的不是苛刻，是减少扯皮和返工，让交付更可控。',
    },
  ],
  '7d-mgmt-day-5': [
    {
      id: 'd5-q1',
      question: '好的过程管理应该关注什么？',
      options: [
        { label: '员工是否加班', value: 1 },
        { label: '每天汇报详细进度', value: 2 },
        { label: '风险是否暴露', value: 3 },
        { label: '会议是否准时', value: 4 },
      ],
      correct: 3,
      explanation: '过程管理要让进度、质量、风险可见，盯风险而不是盯人。',
    },
    {
      id: 'd5-q2',
      question: '什么情况下应该立刻升级风险？',
      options: [
        { label: '员工请假时', value: 1 },
        { label: '可能延期/质量不可控/跨部门卡住', value: 2 },
        { label: '老板问起时', value: 3 },
        { label: '项目结束时', value: 4 },
      ],
      correct: 2,
      explanation: '当发现"可能延期/质量不可控/跨部门卡住"时，应该立刻升级，而不是自己硬扛。',
    },
  ],
  '7d-mgmt-day-6': [
    {
      id: 'd6-q1',
      question: '好的反馈应该具备什么特点？',
      options: [
        { label: '严厉、直接、公开', value: 1 },
        { label: '及时、具体、能改', value: 2 },
        { label: '委婉、模糊、私下', value: 3 },
        { label: '详细、全面、正式', value: 4 },
      ],
      correct: 2,
      explanation: '好的反馈有三个特点：及时、具体、能改。',
    },
    {
      id: 'd6-q2',
      question: '反馈应该针对什么？',
      options: [
        { label: '人格', value: 1 },
        { label: '态度', value: 2 },
        { label: '行为', value: 3 },
        { label: '能力', value: 4 },
      ],
      correct: 3,
      explanation: '反馈要针对行为，不要攻击人格。人可以被要求，事可以被纠正，但不要随便否定一个人。',
    },
  ],
  '7d-mgmt-day-7': [
    {
      id: 'd7-q1',
      question: '机制的作用是什么？',
      options: [
        { label: '限制团队灵活性', value: 1 },
        { label: '让新人来了知道怎么做，不靠个人英雄主义', value: 2 },
        { label: '增加管理者的权威', value: 3 },
        { label: '让流程更复杂', value: 4 },
      ],
      correct: 2,
      explanation: '机制让"新人来了知道怎么做、项目来了知道怎么拆、问题来了知道找谁"，不靠个人英雄主义也能稳定产出。',
    },
    {
      id: 'd7-q2',
      question: '应该优先沉淀什么机制？',
      options: [
        { label: '最复杂的流程', value: 1 },
        { label: '老板最关心的事', value: 2 },
        { label: '最高频、最高风险的问题', value: 3 },
        { label: '所有工作流程', value: 4 },
      ],
      correct: 3,
      explanation: '机制先做"最小可用"，解决最高频、最高风险的问题，不是一次性把一切都流程化。',
    },
  ],
}

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
  const [bookData, setBookData] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentBook = books[0]

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    })
  }, [])

  // 加载书籍数据
  useEffect(() => {
    async function loadBook() {
      setLoading(true)
      const data = await getBook(currentBook.id)
      setBookData(data)
      if (data?.days?.length > 0) {
        setSelectedDay(data.days[0])
      }
      setLoading(false)
    }
    loadBook()
  }, [])

  const handleSelectDay = (day) => {
    setSelectedDay(day)
    setShowQuiz(false)
    setQuizAnswers({})
    setShowResults(false)
  }

  const handleQuizAnswer = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!selectedDay) return 0
    const dayQuiz = quizData[selectedDay.id] || []
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
    const dayQuiz = quizData[selectedDay.id] || []

    return (
      <div className="space-y-6">
        {/* 返回按钮 */}
        <button
          onClick={() => { setSelectedDay(null); setShowQuiz(false); }}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span>←</span> 返回{bookData.title}
        </button>

        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{bookData.cover}</span>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{bookData.title}</h1>
              <p className="text-sm text-[var(--text-secondary)]">第{selectedDay.day}天：{selectedDay.title}</p>
            </div>
          </div>
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
        </div>

        {/* 内容区域 */}
        {showQuiz ? (
          /* 测试视图 */
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                📝 第{selectedDay.day}天 小测试
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
                  第{day.day}天
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
        <div className="grid grid-cols-1 gap-6">
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => {
                getBook(book.id).then(data => {
                  setBookData(data)
                  if (data?.days?.length > 0) {
                    setSelectedDay(data.days[0])
                  }
                })
              }}
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
                      <span className="text-sm text-[var(--text-muted)]">{book.totalDays} 天内容</span>
                      <span className="text-[var(--text-primary)] font-medium">开始阅读 →</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
