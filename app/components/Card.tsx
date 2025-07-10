import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out ${className}`}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      {children}
    </motion.div>
  )
}

