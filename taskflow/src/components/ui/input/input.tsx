import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="input-group">
      {label ? (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className="input-field"
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? (
        <p role="alert" className="input-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
