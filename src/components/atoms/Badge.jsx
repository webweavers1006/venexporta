export function Badge({ variant = 'pro', children }) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${variant === 'pro' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
        {children}
      </span>
    )
  }
  