export default function PromptCard({ prompt, isRead, isFavorite, onToggleRead, onToggleFavorite }) {
  return (
    <div className={`bg-[var(--bg-card)] border rounded-2xl p-6 transition-all duration-300 group
      ${isRead
        ? 'border-emerald-500/50 shadow-md shadow-emerald-500/5'
        : 'border-[var(--border-color)] hover:border-[var(--text-primary)] hover:shadow-lg'
      }`}>
      {/* category badge */}
      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--hover-bg)] text-[var(--text-secondary)] mb-4">
        {prompt.category}
      </span>

      {/* title */}
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-3 leading-snug">
        {prompt.title}
      </h3>

      {/* content */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{prompt.content}</p>

      {/* action buttons */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => onToggleRead(prompt.id)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors
            ${isRead ? 'text-emerald-600' : 'text-[var(--text-muted)] hover:text-emerald-600'}`}
        >
          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
            {isRead ? '✓' : ''}
          </span>
          <span>{isRead ? '已读' : '标记已读'}</span>
        </button>
        <button
          onClick={() => onToggleFavorite(prompt.id)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors
            ${isFavorite ? 'text-amber-600' : 'text-[var(--text-muted)] hover:text-amber-600'}`}
        >
          <span className="text-sm">{isFavorite ? '★' : '☆'}</span>
          <span>{isFavorite ? '已收藏' : '收藏'}</span>
        </button>
      </div>
    </div>
  )
}
