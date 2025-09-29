// src/components/Button.tsx
type ButtonProps = {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  const base = 'py-2 px-4 rounded-full transition-colors duration-200'
  const styles = {
    primary: `${base} bg-green-500 text-white hover:bg-green-600`,
    secondary: `${base} bg-gray-300 text-gray-700 hover:bg-gray-400`,
  }

  return <button className={styles[variant]} onClick={onClick}>{label}</button>
}

export default Button
