
interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  varient?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export function Button({ onClick, className, children, varient = 'primary', size = 'md', icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 rounded-full cursor-pointer shadow text-nowrap whitespace-nowrap font-semibold 
        ${size === 'sm' ? 'text-xs px-3 py-2' : size === 'lg' ? 'text-base px-6 py-3' : 'text-sm px-4 py-2.5'} 
        ${varient === 'primary' ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-100'} ${className}`}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </button>
  )
}