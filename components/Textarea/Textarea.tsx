import React, { forwardRef, useEffect, useRef } from 'react'
import clsx from 'clsx'

const MAX_LENGTH = 256

type TTextareaVariants = 'primary' | 'secondary'

type TTextareaProps = {
  variant?: TTextareaVariants
  placeholder?: string
  className?: string
  maxLength?: number
  readOnly?: boolean
  contentRef?: any
  onFocus?: () => void
  onBlur?: () => void
}

const textareaVariants = {
  primary: '',
  secondary:
    'border border-gray-200 rounded-md p-3 transition-colors duration-200 focus-within:outline-tertiary-500 outline outline-1 outline-transparent focus-within:border-tertiary-500',
}

const Textarea = forwardRef<HTMLDivElement, TTextareaProps>(
  (
    {
      variant = 'primary',
      placeholder = 'Type something here',
      className,
      maxLength = MAX_LENGTH,
      contentRef,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const defaultClassName = 'relative'
    const allClassNames = clsx(
      defaultClassName,
      className,
      textareaVariants[variant]
    )
    const placeholderRef = useRef(null)
    const textContent =
      ref && 'current' in ref && ref.current && ref.current.textContent

    useEffect(() => {
      if (
        ref &&
        'current' in ref &&
        ref.current &&
        ref.current.textContent?.trim().length
      ) {
        if (placeholderRef.current) {
          ;(placeholderRef.current as HTMLSpanElement).textContent = ''
        }
      }
    }, [textContent])

    useEffect(() => {
      const handlePasteText = (e) => {
        if (ref && 'current' in ref && ref.current) {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertHTML', false, text)
        }
      }

      window.addEventListener('paste', handlePasteText)
      return () => window.removeEventListener('paste', handlePasteText)
    }, [])

    const onKeyPress = (e) => {
      const value = e.target.textContent + e.key
      const placeholderEl = placeholderRef.current

      if (placeholderEl && value.trim().length) {
        ;(placeholderEl as HTMLSpanElement).textContent = ''
      }
    }

    const onKeyUp = (e) => {
      const SPACEBAR_CODE = 32
      const placeholderEl = placeholderRef.current

      if (e.keyCode === SPACEBAR_CODE && placeholderEl) {
        ;(placeholderEl as HTMLSpanElement).textContent = ''
      }

      if (contentRef && e.key !== 'Enter') {
        contentRef.current = e.target.innerText
      }

      if (placeholderEl && (e.key === 'Backspace' || e.key === 'Delete')) {
        const isEmpty = !e.target.textContent.trim()

        ;(placeholderEl as HTMLSpanElement).textContent = isEmpty
          ? placeholder
          : ''
      }
    }

    const onKeyDown = (e) => {
      const charCode = String.fromCharCode(e.which).toLowerCase()

      if ((e.ctrlKey || e.metaKey) && charCode === 'v') {
        const placeholderEl = placeholderRef.current

        if (placeholderEl) {
          ;(placeholderEl as HTMLSpanElement).textContent = ''
        }
      }
    }

    return (
      <div
        className={allClassNames}
        tabIndex={-1}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className="relative h-full w-full">
          <div
            ref={ref}
            className={clsx('w-full break-all outline-none', className)}
            contentEditable="true"
            onKeyPress={onKeyPress}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            {...rest}
          ></div>
          <span
            ref={placeholderRef}
            className="pointer-events-none absolute top-0 left-0 select-none text-gray-400"
          >
            {placeholder}
          </span>
        </div>
      </div>
    )
  }
)

export default Textarea
