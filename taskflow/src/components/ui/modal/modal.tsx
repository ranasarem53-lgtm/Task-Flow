import { useEffect, useRef, type ReactNode } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === backdropRef.current) {
          onClose()
        }
      }}
    >
      <section role="dialog" aria-modal="true" aria-label={title}>
        {title ? <h2>{title}</h2> : null}
        {children}
      </section>
    </div>
  )
}
