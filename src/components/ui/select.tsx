import * as React from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: React.ReactNode
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  options?: SelectOption[]
  onValueChange?: (value: string) => void
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  size?: 'sm' | 'default' | 'lg'
  placeholder?: string
  align?: 'left' | 'right'
}

function extractOptionsFromChildren(children: React.ReactNode): SelectOption[] {
  const extracted: SelectOption[] = []
  const traverse = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child) => {
      if (!React.isValidElement(child)) return
      const props = child.props as any
      if (child.type === 'option' || (props && props.value !== undefined)) {
        extracted.push({
          value: String(props.value),
          label: props.children ?? String(props.value),
          disabled: Boolean(props.disabled),
        })
      } else if (props && props.children) {
        traverse(props.children)
      }
    })
  }
  traverse(children)
  return extracted
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      options,
      value,
      defaultValue,
      onValueChange,
      onChange,
      placeholder = 'Pilih opsi...',
      disabled = false,
      size = 'default',
      align = 'left',
      name,
      required,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [openUpward, setOpenUpward] = React.useState(false)
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    const effectiveOptions = React.useMemo(() => {
      if (options && options.length > 0) return options
      return extractOptionsFromChildren(children)
    }, [options, children])

    const isControlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(() => {
      if (defaultValue !== undefined) return String(defaultValue)
      return effectiveOptions[0]?.value ?? ''
    })

    const currentValue = isControlled ? String(value) : uncontrolledValue
    const selectedOption = effectiveOptions.find((opt) => opt.value === currentValue)

    const displayLabel = selectedOption
      ? selectedOption.label
      : placeholder || effectiveOptions[0]?.label || ''

    const handleSelect = (optionValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(optionValue)
      }
      onValueChange?.(optionValue)
      if (onChange) {
        const syntheticEvent = {
          target: { value: optionValue, name: name || '' },
          currentTarget: { value: optionValue, name: name || '' },
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          nativeEvent: new Event('change'),
          persist: () => {},
          preventDefault: () => {},
          isDefaultPrevented: () => false,
          stopPropagation: () => {},
          isPropagationStopped: () => false,
          timeStamp: Date.now(),
          type: 'change',
        } as unknown as React.ChangeEvent<HTMLSelectElement>
        onChange(syntheticEvent)
      }
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    React.useEffect(() => {
      if (isOpen) {
        const idx = effectiveOptions.findIndex((o) => o.value === currentValue)
        setHighlightedIndex(idx >= 0 ? idx : 0)

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const spaceBelow = window.innerHeight - rect.bottom
          setOpenUpward(spaceBelow < 220 && rect.top > 220)
        }
      }
    }, [isOpen, currentValue, effectiveOptions])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
      }
    }, [isOpen])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Escape') {
        setIsOpen(false)
        e.preventDefault()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => {
            let next = prev + 1 >= effectiveOptions.length ? 0 : prev + 1
            while (effectiveOptions[next]?.disabled && next !== prev) {
              next = next + 1 >= effectiveOptions.length ? 0 : next + 1
            }
            return next
          })
        }
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => {
            let next = prev - 1 < 0 ? effectiveOptions.length - 1 : prev - 1
            while (effectiveOptions[next]?.disabled && next !== prev) {
              next = next - 1 < 0 ? effectiveOptions.length - 1 : next - 1
            }
            return next
          })
        }
        return
      }

      if (e.key === 'Enter' || e.key === ' ') {
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < effectiveOptions.length) {
          e.preventDefault()
          const chosen = effectiveOptions[highlightedIndex]
          if (chosen && !chosen.disabled) {
            handleSelect(chosen.value)
          }
        } else if (!isOpen) {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      if (e.key === 'Tab' && isOpen) {
        setIsOpen(false)
      }
    }

    const classList = (className || '').split(/\s+/).filter(Boolean)
    const widthClasses = classList.filter(
      (c) =>
        c.startsWith('w-') ||
        c.startsWith('min-w-') ||
        c.startsWith('max-w-') ||
        c.startsWith('flex-') ||
        c.startsWith('col-span')
    )
    const isFullWidth = !widthClasses.some((c) => c.startsWith('w-') || c.startsWith('max-w-'))
    const isSmall = size === 'sm' || className?.includes('h-8') || className?.includes('text-xs')
    const isLarge = size === 'lg'

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative inline-block select-none text-left',
          isFullWidth ? 'w-full' : widthClasses.join(' '),
          classList.filter((c) => c.startsWith('col-span') || c.startsWith('flex-')).join(' ')
        )}
      >
        {/* Hidden native select for form validation & DOM compatibility */}
        <select
          ref={ref}
          name={name}
          value={currentValue}
          disabled={disabled}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only pointer-events-none absolute opacity-0"
          onChange={(e) => handleSelect(e.target.value)}
          {...props}
        >
          {effectiveOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {typeof opt.label === 'string' ? opt.label : opt.value}
            </option>
          ))}
        </select>

        {/* Custom Dropdown Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'flex w-full items-center justify-between gap-1.5 rounded-lg border border-border bg-card text-foreground transition-all duration-150 outline-none cursor-pointer shadow-2xs hover:bg-secondary/40 focus:border-accent1 focus:ring-2 focus:ring-accent1/20',
            isSmall
              ? 'h-8 text-xs px-2.5'
              : isLarge
              ? 'h-11 text-sm px-4'
              : 'h-9 text-xs sm:text-sm px-3',
            isOpen && 'border-accent1 ring-2 ring-accent1/20 bg-card',
            disabled && 'opacity-50 cursor-not-allowed',
            classList
              .filter(
                (c) =>
                  !c.startsWith('w-') &&
                  !c.startsWith('col-span') &&
                  !c.startsWith('flex-') &&
                  !c.startsWith('h-') &&
                  !c.startsWith('text-')
              )
              .join(' ')
          )}
        >
          <div className="flex items-center gap-1.5 truncate flex-1 text-left">
            {selectedOption?.icon && (
              <span className="shrink-0 text-muted-foreground">{selectedOption.icon}</span>
            )}
            <span
              className={cn(
                'truncate font-medium',
                !selectedOption && 'text-muted-foreground font-normal'
              )}
            >
              {displayLabel}
            </span>
          </div>
          <CaretDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
              isOpen && 'rotate-180 text-accent1'
            )}
            weight="bold"
          />
        </button>

        {/* Custom Styled Dropdown Popover */}
        {isOpen && (
          <div
            role="listbox"
            className={cn(
              'absolute z-50 min-w-full w-max max-w-xs rounded-xl border border-border bg-card p-1 shadow-lg',
              align === 'right' ? 'right-0 left-auto' : 'left-0 right-auto',
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            )}
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
              {effectiveOptions.map((opt, idx) => {
                const isSelected = opt.value === currentValue
                const isHighlighted = idx === highlightedIndex
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'group w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer select-none',
                      isSelected
                        ? 'bg-accent1/10 text-accent1 font-semibold'
                        : isHighlighted
                        ? 'bg-secondary text-foreground'
                        : 'text-foreground hover:bg-secondary/70',
                      opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <div>{opt.label}</div>
                        {opt.description && (
                          <div className="text-2xs text-muted-foreground font-normal">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent1 shrink-0" weight="bold" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

