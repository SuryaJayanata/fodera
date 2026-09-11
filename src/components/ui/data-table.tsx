import React, { useState, useMemo, useEffect } from 'react'
import {
  CaretUpDown,
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
  Tray,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import { Button } from './button'
import { Select } from './select'
import { cn } from '@/lib/utils'

export interface ColumnDef<T> {
  id: string
  header: React.ReactNode
  accessorKey?: keyof T
  cell?: (row: T, index: number) => React.ReactNode
  sortable?: boolean
  sortComparator?: (a: T, b: T) => number
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor?: (row: T, index: number) => string | number
  title?: React.ReactNode
  description?: React.ReactNode
  headerRight?: React.ReactNode
  showRowNumbers?: boolean
  rowNumberHeader?: string
  defaultSortField?: string
  defaultSortOrder?: 'asc' | 'desc'
  defaultPageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  emptyDescription?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  description,
  headerRight,
  showRowNumbers = true,
  rowNumberHeader = 'No',
  defaultSortField,
  defaultSortOrder = 'asc',
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  emptyMessage = 'Tidak ada data yang ditemukan',
  emptyDescription,
  className,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string | undefined>(
    defaultSortField || (columns.find((c) => c.sortable)?.id)
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return data
    const column = columns.find((c) => c.id === sortField)
    if (!column || !column.sortable) return data

    return [...data].sort((a, b) => {
      let comp = 0
      if (column.sortComparator) {
        comp = column.sortComparator(a, b)
      } else if (column.accessorKey) {
        const aVal = a[column.accessorKey]
        const bVal = b[column.accessorKey]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comp = aVal - bVal
        } else {
          comp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
            numeric: true,
          })
        }
      }
      return sortOrder === 'asc' ? comp : -comp
    })
  }, [data, columns, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, sortedData.length)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (fieldId: string) => {
    if (sortField === fieldId) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(fieldId)
      setSortOrder('asc')
    }
  }

  const renderSortIcon = (fieldId: string) => {
    if (sortField !== fieldId) {
      return (
        <CaretUpDown
          className="h-3 w-3 text-muted-foreground/50 transition-colors group-hover:text-foreground shrink-0"
          weight="bold"
        />
      )
    }
    if (sortOrder === 'asc') {
      return <CaretUp className="h-3 w-3 text-accent1 shrink-0" weight="bold" />
    }
    return <CaretDown className="h-3 w-3 text-accent1 shrink-0" weight="bold" />
  }

  const getVisiblePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('ellipsis')
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      if (safePage < totalPages - 2) pages.push('ellipsis')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  const hasHeader = Boolean(title || description || headerRight)

  return (
    <Card className={cn('rounded-2xl border border-border bg-card shadow-xs overflow-hidden', className)}>
      {hasHeader && (
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </CardHeader>
      )}

      <CardContent className={cn('p-0', !hasHeader && 'pt-0')}>
        <div className="relative overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
              <tr>
                {showRowNumbers && (
                  <th className="py-2.5 px-3 w-12 text-center text-muted-foreground font-semibold">
                    {rowNumberHeader}
                  </th>
                )}
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'

                  if (col.sortable) {
                    return (
                      <th
                        key={col.id}
                        onClick={() => handleSort(col.id)}
                        className={cn(
                          'py-2.5 px-3 cursor-pointer select-none group hover:text-foreground hover:bg-secondary/60 transition-colors',
                          alignClass,
                          col.headerClassName
                        )}
                      >
                        <div
                          className={cn(
                            'inline-flex items-center gap-1',
                            col.align === 'center' && 'justify-center',
                            col.align === 'right' && 'justify-end'
                          )}
                        >
                          <span>{col.header}</span>
                          {renderSortIcon(col.id)}
                        </div>
                      </th>
                    )
                  }

                  return (
                    <th key={col.id} className={cn('py-2.5 px-3', alignClass, col.headerClassName)}>
                      {col.header}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tray className="h-8 w-8 text-muted-foreground/40" weight="duotone" />
                      <span className="text-sm font-semibold text-foreground">{emptyMessage}</span>
                      {emptyDescription && (
                        <span className="text-xs text-muted-foreground max-w-sm">
                          {emptyDescription}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const key = keyExtractor ? keyExtractor(row, index) : index
                  return (
                    <tr key={key} className="hover:bg-secondary/30 transition-colors">
                      {showRowNumbers && (
                        <td className="py-3 px-3 text-center font-mono text-muted-foreground text-2xs">
                          {startIndex + index + 1}
                        </td>
                      )}
                      {columns.map((col) => {
                        const alignClass =
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'

                        return (
                          <td key={col.id} className={cn('py-3 px-3', alignClass, col.className)}>
                            {col.cell
                              ? col.cell(row, startIndex + index)
                              : col.accessorKey
                              ? String(row[col.accessorKey] ?? '')
                              : null}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        {sortedData.length > 0 && (
          <div className="border-t border-border px-4 py-3 bg-secondary/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Left Info & Page Size */}
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span>
                Menampilkan{' '}
                <strong className="font-semibold text-foreground">{startIndex + 1}</strong> -{' '}
                <strong className="font-semibold text-foreground">{endIndex}</strong> dari{' '}
                <strong className="font-semibold text-foreground">{sortedData.length}</strong> data
              </span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-border">
                <span className="text-2xs">Baris:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val))
                    setCurrentPage(1)
                  }}
                  className="h-7 text-xs w-16"
                  size="sm"
                  options={pageSizeOptions.map((opt) => ({
                    value: String(opt),
                    label: String(opt),
                  }))}
                />
              </div>
            </div>

            {/* Right Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage === 1}
                  className="h-7 w-7 p-0"
                  title="Halaman Pertama"
                >
                  <CaretDoubleLeft className="h-3.5 w-3.5" weight="bold" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="h-7 w-7 p-0"
                  title="Halaman Sebelumnya"
                >
                  <CaretLeft className="h-3.5 w-3.5" weight="bold" />
                </Button>

                <div className="flex items-center gap-1 px-1">
                  {getVisiblePageNumbers().map((p, i) => {
                    if (p === 'ellipsis') {
                      return (
                        <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    const isCurrent = p === safePage
                    return (
                      <Button
                        key={p}
                        variant={isCurrent ? 'accent1' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        className={cn(
                          'h-7 min-w-7 px-2 text-xs font-medium',
                          isCurrent && 'font-bold shadow-2xs'
                        )}
                      >
                        {p}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="h-7 w-7 p-0"
                  title="Halaman Selanjutnya"
                >
                  <CaretRight className="h-3.5 w-3.5" weight="bold" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="h-7 w-7 p-0"
                  title="Halaman Terakhir"
                >
                  <CaretDoubleRight className="h-3.5 w-3.5" weight="bold" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
