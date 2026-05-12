import { create } from 'zustand'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'fps-store'

const defaultState = {
  // Prompts
  todayDate: '',
  readPrompts: [],
  favoritePrompts: [],

  // Quiz
  quizHistory: [],

  // Settings
  dailyReminder: true,
}

const useStore = create((set, get) => ({
  ...defaultState,

  init() {
    const saved = getStorage(STORAGE_KEY, {})
    const today = new Date().toDateString()
    if (saved.todayDate !== today) {
      saved.readPrompts = []
      saved.todayDate = today
    }
    set({ ...defaultState, ...saved, todayDate: saved.todayDate || today })
  },

  markRead(promptId) {
    const read = [...get().readPrompts]
    if (!read.includes(promptId)) {
      read.push(promptId)
      set({ readPrompts: read })
      setStorage(STORAGE_KEY, get())
    }
  },

  toggleFavorite(promptId) {
    const favs = get().favoritePrompts
    const updated = favs.includes(promptId)
      ? favs.filter(id => id !== promptId)
      : [...favs, promptId]
    set({ favoritePrompts: updated })
    setStorage(STORAGE_KEY, get())
  },

  saveQuizResult(result) {
    const history = [...get().quizHistory, { ...result, date: new Date().toISOString() }]
    set({ quizHistory: history })
    setStorage(STORAGE_KEY, get())
  },

  setDailyReminder(enabled) {
    set({ dailyReminder: enabled })
    setStorage(STORAGE_KEY, get())
  },
}))

// Persist on every state change
const originalSubscribe = useStore.subscribe
useStore.subscribe = (listener) => {
  return originalSubscribe((state) => {
    setStorage(STORAGE_KEY, state)
    listener(state)
  })
}

export default useStore
