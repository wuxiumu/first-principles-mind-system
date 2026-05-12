// 自我测评题库 - Phase 1: 基础评估题
// 每个维度5题，单选打分 1-5 分

const quizCategories = [
  {
    id: 'goal-clarity',
    name: '目标清晰度',
    description: '你是否有清晰的目标体系，能把大目标拆成可执行的最小单元？',
    questions: [
      {
        id: 'gc-1',
        text: '我能用一句话清楚描述我目前最重要的目标。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'gc-2',
        text: '我知道把大目标拆成小任务的具体方法。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'gc-3',
        text: '我每天早上知道今天最重要的那件事是什么。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'gc-4',
        text: '我的目标都有明确的截止时间和完成标准。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'gc-5',
        text: '我能区分"忙碌"和"有效"，不混淆两者。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'execution',
    name: '执行力',
    description: '你从"想到"到"做到"的转化能力如何？',
    questions: [
      {
        id: 'ex-1',
        text: '我决定的事情，通常能在24小时内开始行动。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ex-2',
        text: '我遇到困难时倾向于先做再改，而不是等完美方案。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ex-3',
        text: '我能坚持完成一个需要连续多日投入的任务。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ex-4',
        text: '我给自己设的截止日期基本都能遵守。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ex-5',
        text: '我会主动屏蔽干扰（手机、无关消息），专注重要事务。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'review-habit',
    name: '复盘习惯',
    description: '你是否有系统的复盘和反思习惯？',
    questions: [
      {
        id: 'rh-1',
        text: '我有固定的复盘习惯（每天或每周）。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'rh-2',
        text: '我会把复盘的结果写下来，而不是只在脑子里想。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'rh-3',
        text: '我能说出近期因为复盘而做出的具体改进。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'rh-4',
        text: '复盘时我能客观分析自己的问题，不找借口。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'rh-5',
        text: '我会定期回顾过去的复盘记录，发现模式。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'emotion-control',
    name: '情绪管理',
    description: '你在压力和情绪下的自我管理能力如何？',
    questions: [
      {
        id: 'ec-1',
        text: '遇到突发问题时，我能先冷静再处理。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ec-2',
        text: '我能区分事实和感受，不被情绪判断左右。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ec-3',
        text: '面对批评或不同意见，我能理性吸收而非抵触。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ec-4',
        text: '我有清晰的情绪调节方法（如运动、记录、沟通）。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
      {
        id: 'ec-5',
        text: '我能把注意力放在"能控制的事"上，不内耗。',
        options: [
          { label: '完全不符合', value: 1 },
          { label: '不太符合', value: 2 },
          { label: '说不清', value: 3 },
          { label: '比较符合', value: 4 },
          { label: '完全符合', value: 5 },
        ],
      },
    ],
  },
]

export default quizCategories
