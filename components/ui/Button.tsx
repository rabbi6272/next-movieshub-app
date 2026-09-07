
interface ButtonProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
  varient?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ onClick, className, children, varient = 'primary', size = 'md' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs md:text-sm font-semibold rounded-full cursor-pointer shadow
        ${size === 'sm' ? 'text-xs px-2.5 py-1' : size === 'lg' ? 'text-base font-medium px-6 py-2.5' : 'text-sm px-3.5 py-1.5'} 
        ${varient === 'primary' ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-100'} ${className}`}
    >
      {children}
    </button>
  )
}