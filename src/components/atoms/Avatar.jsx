export function Avatar({ src, alt, size = 80 }) {
    return (
      <div className="relative rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <img src={src || "https://via.placeholder.com/80"} alt={alt} className="object-cover w-full h-full" />
      </div>
    )
  }
  
  