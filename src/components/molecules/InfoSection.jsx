export function InfoSection({ title, children }) {
    return (
      <div className="space-y-2">
        <h2 className="text-base bold text-gray-600">{title}</h2>
        <div className="text-base text-gray-500">{children}</div>
      </div>
    )
  }
  
  