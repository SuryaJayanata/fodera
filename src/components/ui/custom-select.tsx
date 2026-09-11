import React from 'react'
import { Select, SelectOption, SelectProps } from './select'

export type { SelectOption }

export interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'default' | 'lg'
  align?: 'left' | 'right'
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi...',
  className,
  disabled = false,
  size,
  align,
}: CustomSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      options={options}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      size={size}
      align={align}
    />
  )
}

