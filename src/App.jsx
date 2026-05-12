import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './views/Home'
import QuickPrompts from './views/QuickPrompts'
import SelfQuiz from './views/SelfQuiz'
import About from './views/About'
import Demo from './views/Demo'
import BookNotes from './views/BookNotes'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompts" element={<QuickPrompts />} />
          <Route path="/quiz" element={<SelfQuiz />} />
          <Route path="/books" element={<BookNotes />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
