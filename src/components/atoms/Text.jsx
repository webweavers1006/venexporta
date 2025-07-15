export function Text({ children, className, as: Component = "p", ...props }) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  }
  
  