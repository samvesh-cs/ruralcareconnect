/**
 * FormInput – labeled input or textarea with validation state.
 *
 * Props:
 *   id          string   – input id (required for label association)
 *   label       string   – visible label text
 *   type        string   – 'text' | 'tel' | 'number' | 'select' | 'textarea'
 *   value       any      – controlled value
 *   onChange    fn       – onChange handler
 *   placeholder string
 *   options     Array<{value, label}> – required when type === 'select'
 *   error       string   – error message; renders red border + message
 *   required    bool
 *   rows        number   – for textarea (default 3)
 *   className   string   – extra classes on the wrapper
 */
export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  options = [],
  error,
  required = false,
  rows = 3,
  className = '',
}) {
  const baseClass = [
    'input-field',
    error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : '',
  ].join(' ')

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClass}
        >
          <option value="" disabled>
            {placeholder || 'Select…'}
          </option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}

      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  )
}
