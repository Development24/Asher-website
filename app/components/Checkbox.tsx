interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-3 mb-3 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-red-600 transition duration-150 ease-in-out"
        {...props}
      />
      <span className="text-gray-900 dark:text-gray-300 font-medium">{label}</span>
    </label>
  )
}

