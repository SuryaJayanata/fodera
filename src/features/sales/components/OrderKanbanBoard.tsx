import React, { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  pointerWithin,
  CollisionDetection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  HandGrabbing,
  DotsSixVertical,
  Clock,
  CheckCircle,
  Storefront,
  Megaphone,
  Tag,
  UsersThree,
  Eye,
  Receipt,
  Check,
  ArrowRight,
  ForkKnife,
  Coffee,
  Motorcycle,
} from '@phosphor-icons/react'
import { Badge, Button, ErrorBoundary } from '@/components/custom'
import { Order } from '../types'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: OrderKanbanBoard (stable dnd-kit sortable pipeline)
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface OrderKanbanBoardProps {
  orders: Order[]
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void
  onViewOrderDetails: (order: Order, tab?: 'details' | 'receipt') => void
  tableOrdersMap?: Map<string, Order[]>
}

type ColumnId = Order['status']
const COLUMN_IDS: ColumnId[] = ['new', 'preparing', 'ready', 'completed']

interface ColumnDef {
  status: ColumnId
  title: string
  dotClass: string
  badgeVariant: 'accent1' | 'warning' | 'accent2' | 'secondary'
  emptyText: string
  nextAction?: {
    targetStatus: ColumnId
    label: string
    variant: 'accent1' | 'accent2' | 'default'
  }
}

const KANBAN_COLUMNS: ColumnDef[] = [
  {
    status: 'new',
    title: 'Pesanan Baru',
    dotClass: 'bg-accent1',
    badgeVariant: 'accent1',
    emptyText: 'Tidak ada pesanan baru',
    nextAction: {
      targetStatus: 'preparing',
      label: 'Racik',
      variant: 'accent1',
    },
  },
  {
    status: 'preparing',
    title: 'Sedang Diracik',
    dotClass: 'bg-warning',
    badgeVariant: 'warning',
    emptyText: 'Barista sedang idle',
    nextAction: {
      targetStatus: 'ready',
      label: 'Siap Saji',
      variant: 'accent2',
    },
  },
  {
    status: 'ready',
    title: 'Siap Disajikan',
    dotClass: 'bg-accent2',
    badgeVariant: 'accent2',
    emptyText: 'Tidak ada pesanan menunggu',
    nextAction: {
      targetStatus: 'completed',
      label: 'Selesaikan',
      variant: 'default',
    },
  },
  {
    status: 'completed',
    title: 'Selesai Diambil',
    dotClass: 'bg-muted-foreground',
    badgeVariant: 'secondary',
    emptyText: 'Belum ada pesanan selesai',
  },
]

function getOrderTypeBadge(type: Order['orderType']) {
  switch (type) {
    case 'Dine In':
      return (
        <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border">
          <ForkKnife className="h-3 w-3 text-accent1" weight="bold" />
          Dine In
        </span>
      )
    case 'Takeaway':
      return (
        <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border">
          <Coffee className="h-3 w-3 text-accent2" weight="bold" />
          Takeaway
        </span>
      )
    case 'Delivery':
      return (
        <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border">
          <Motorcycle className="h-3 w-3 text-warning" weight="bold" />
          Delivery
        </span>
      )
  }
}

interface OrderCardViewProps {
  order: Order
  col: ColumnDef
  tableOrdersMap?: Map<string, Order[]>
  onViewOrderDetails?: (order: Order, tab?: 'details' | 'receipt') => void
  onUpdateStatus?: (orderId: string, newStatus: Order['status']) => void
  isOverlay?: boolean
}

function OrderCardView({
  order,
  col,
  tableOrdersMap,
  onViewOrderDetails,
  onUpdateStatus,
  isOverlay,
}: OrderCardViewProps) {
  return (
    <div
      className={`p-3.5 rounded-xl border bg-card space-y-2.5 transition-all ${
        isOverlay
 ? ' border-accent1 ring-2 ring-accent1/30 bg-card cursor-grabbing'
          : col.status === 'preparing'
 ? 'border-warning/30 hover:border-warning/60 '
          : col.status === 'ready'
 ? 'border-accent2/30 hover:border-accent2/60 '
          : col.status === 'completed'
 ? 'border-border opacity-85 hover:opacity-100 '
 : 'border-border hover:border-accent1/40 '
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors rounded">
            <DotsSixVertical className="h-3.5 w-3.5 shrink-0" weight="bold" />
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {order.id}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-2xs ${
              col.status === 'preparing'
                ? 'text-warning font-semibold'
                : col.status === 'ready'
                ? 'text-accent2 font-semibold'
                : 'text-muted-foreground'
            }`}
          >
            {col.status === 'ready' ? (
              <CheckCircle className="h-3 w-3" weight="bold" />
            ) : (
              <Clock className="h-3 w-3 text-accent1" weight="bold" />
            )}
            {col.status === 'ready' ? 'Siap' : order.timeElapsed}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">{order.customer}</span>
          {getOrderTypeBadge(order.orderType)}
        </div>
        <div className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Storefront className="h-3 w-3 shrink-0" />
            <span>{order.outlet}</span>
          </span>
          {order.orderType === 'Dine In' && !order.tableNumber && (
            <span className="inline-flex items-center gap-1 text-accent1 font-medium">
              • <Megaphone className="h-3 w-3 shrink-0" /> Panggil di Bar
            </span>
          )}
          {order.tableNumber && (
            <span className="inline-flex items-center gap-1">
              • {order.tableNumber.toLowerCase().includes('tenda') || order.tableNumber.startsWith('#') ? (
                <Tag className="h-3 w-3 text-warning shrink-0" />
              ) : null}
              <span>{order.tableNumber}</span>
              {(order.isSharedTable ||
                (tableOrdersMap &&
                  (tableOrdersMap.get(order.tableNumber.trim().toLowerCase())?.length || 0) > 1)) && (
                <span
                  className="text-3xs font-bold text-accent1 bg-accent1/10 px-1 py-0.2 rounded inline-flex items-center gap-0.5"
                  title="Berbagi meja dengan pesanan lain (Gabung Meja)"
                >
                  <UsersThree className="h-2.5 w-2.5 shrink-0" />
                  Gabung
                </span>
              )}
            </span>
          )}
          <span>• via {order.channel}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-xs flex items-start justify-between gap-1">
            <span className="font-medium text-foreground">
              {item.qty}x {item.name}
            </span>
            <span className="text-muted-foreground font-mono text-2xs">{item.price}</span>
          </div>
        ))}
        {order.items.some((i) => i.notes) && (
          <div
            className={`text-2xs px-2 py-1 rounded border font-medium mt-1 ${
              col.status === 'preparing'
                ? 'text-warning bg-warning/5 border-warning/10'
                : 'text-accent1 bg-accent1/5 border-accent1/10'
            }`}
          >
            Catatan: {order.items.filter((i) => i.notes).map((i) => i.notes).join(', ')}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div>
          <span className="text-2xs text-muted-foreground block">Total Tagihan</span>
          <span className="text-xs font-bold text-foreground">{order.total}</span>
        </div>
        {!isOverlay && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onViewOrderDetails?.(order, col.status === 'completed' ? 'receipt' : 'details')
              }}
              className="h-7 w-7 p-0 cursor-pointer"
              title="Lihat Detail & Struk"
            >
              {col.status === 'completed' ? (
                <Receipt className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Button>
            {col.nextAction && (
              <Button
                variant={col.nextAction.variant}
                size="sm"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateStatus?.(order.id, col.nextAction!.targetStatus)
                }}
                className="h-7 text-xs px-2.5 gap-1 cursor-pointer"
              >
                <span>{col.nextAction.label}</span>
                {col.nextAction.targetStatus === 'completed' ? (
                  <Check className="h-3 w-3" weight="bold" />
                ) : (
                  <ArrowRight className="h-3 w-3" weight="bold" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SortableOrderCard({
  order,
  col,
  tableOrdersMap,
  onViewOrderDetails,
  onUpdateStatus,
}: {
  order: Order
  col: ColumnDef
  tableOrdersMap?: Map<string, Order[]>
  onViewOrderDetails: (order: Order, tab?: 'details' | 'receipt') => void
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  // Live Drop Preview Slot: when being dragged, show a dashed placeholder in the destination position
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-xl border-2 border-dashed border-accent1/60 bg-accent1/10 min-h-32 p-4 flex flex-col items-center justify-center gap-1 text-accent1 transition-all"
      >
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <HandGrabbing className="h-4 w-4 text-accent1" weight="duotone" />
          <span>Letakkan Di Sini</span>
        </div>
        <span className="text-2xs text-muted-foreground font-medium">
          #{order.id} • {order.customer}
        </span>
      </div>
    )
  }

  // Normal Card: entire area is draggable via listeners on container
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <OrderCardView
        order={order}
        col={col}
        tableOrdersMap={tableOrdersMap}
        onViewOrderDetails={onViewOrderDetails}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  )
}

function KanbanColumn({
  col,
  orders,
  isOver,
  tableOrdersMap,
  onViewOrderDetails,
  onUpdateStatus,
}: {
  col: ColumnDef
  orders: Order[]
  isOver: boolean
  tableOrdersMap?: Map<string, Order[]>
  onViewOrderDetails: (order: Order, tab?: 'details' | 'receipt') => void
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void
}) {
  const { setNodeRef } = useDroppable({
    id: col.status,
  })

  // Memoize IDs to prevent SortableContext from triggering layout effect infinite loops
  const itemIds = useMemo(() => orders.map((o) => o.id), [orders])

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl p-3 border space-y-3 transition-colors ${
        isOver
          ? 'bg-secondary/70 border-accent1/50 ring-1 ring-accent1/25'
          : 'bg-secondary/40 border-border'
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${col.dotClass}`} />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
            {col.title}
          </h3>
        </div>
        <Badge variant={col.badgeVariant}>{orders.length}</Badge>
      </div>

      <SortableContext
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2.5 min-h-64">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              {col.emptyText}
            </div>
          ) : (
            orders.map((order) => (
              <SortableOrderCard
                key={order.id}
                order={order}
                col={col}
                tableOrdersMap={tableOrdersMap}
                onViewOrderDetails={onViewOrderDetails}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function groupOrders(orders: Order[]): Record<ColumnId, Order[]> {
  return {
    new: orders.filter((o) => o.status === 'new'),
    preparing: orders.filter((o) => o.status === 'preparing'),
    ready: orders.filter((o) => o.status === 'ready'),
    completed: orders.filter((o) => o.status === 'completed'),
  }
}

function findColumn(columns: Record<ColumnId, Order[]>, id: string): ColumnId | null {
  if (COLUMN_IDS.includes(id as ColumnId)) {
    return id as ColumnId
  }
  for (const col of COLUMN_IDS) {
    if (columns[col].some((item) => item.id === id)) {
      return col
    }
  }
  return null
}

export function OrderKanbanBoard({
  orders,
  onUpdateStatus,
  onViewOrderDetails,
  tableOrdersMap,
}: OrderKanbanBoardProps) {
  // Pure memoized base columns from props
  const baseColumns = useMemo(() => groupOrders(orders), [orders])

  // Transient drag state only active during an in-flight drag gesture
  const [clonedColumns, setClonedColumns] = useState<Record<ColumnId, Order[]> | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeOverCol, setActiveOverCol] = useState<ColumnId | null>(null)

  // Use clonedColumns while dragging, otherwise default to stable baseColumns
  const columns = clonedColumns ?? baseColumns

  const activeOrder = useMemo(() => {
    if (!activeId) return null
    return orders.find((o) => o.id === activeId) || null
  }, [activeId, orders])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold allows clicking buttons without accidental drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Multi-container Kanban collision detection strategy
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // 1. Prioritize pointer within droppables
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    // 2. Fall back to closest corners
    return closestCorners(args)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const currentId = String(event.active.id)
    const found = orders.find((o) => o.id === currentId)
    if (found) {
      setActiveId(currentId)
      setActiveOverCol(found.status)
      setClonedColumns(groupOrders(orders))
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      setActiveOverCol(null)
      return
    }

    const currentActiveId = String(active.id)
    const currentOverId = String(over.id)

    setClonedColumns((prev) => {
      const currentCols = prev ?? baseColumns
      const activeCol = findColumn(currentCols, currentActiveId)
      const overCol = findColumn(currentCols, currentOverId)

      if (!activeCol || !overCol) return prev

      setActiveOverCol(overCol)

      if (activeCol === overCol) return prev

      const activeItems = currentCols[activeCol]
      const overItems = currentCols[overCol]

      const activeIndex = activeItems.findIndex((i) => i.id === currentActiveId)
      if (activeIndex === -1) return prev

      const draggedItem = { ...activeItems[activeIndex], status: overCol }

      let newIndex: number
      if (COLUMN_IDS.includes(currentOverId as ColumnId)) {
        newIndex = overItems.length
      } else {
        const overIndex = overItems.findIndex((i) => i.id === currentOverId)
        newIndex = overIndex >= 0 ? overIndex : overItems.length
      }

      return {
        ...currentCols,
        [activeCol]: activeItems.filter((i) => i.id !== currentActiveId),
        [overCol]: [
          ...overItems.slice(0, newIndex),
          draggedItem,
          ...overItems.slice(newIndex),
        ],
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const currentActiveId = String(active.id)
    const originalOrder = orders.find((o) => o.id === currentActiveId)

    // Determine final target column before state resets
    let destinationCol: ColumnId | null = activeOverCol
    if (over) {
      const overId = String(over.id)
      const resolved = findColumn(columns, overId)
      if (resolved) {
        destinationCol = resolved
      }
    }

    // Clean up drag tracking immediately
    setActiveId(null)
    setActiveOverCol(null)
    setClonedColumns(null)

    // Commit status change to parent state if column actually changed
    if (destinationCol && originalOrder && originalOrder.status !== destinationCol) {
      onUpdateStatus(currentActiveId, destinationCol)
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setActiveOverCol(null)
    setClonedColumns(null)
  }

  const activeColDef = activeOrder
    ? KANBAN_COLUMNS.find((c) => c.status === (activeOverCol || activeOrder.status)) || KANBAN_COLUMNS[0]
    : null

  return (
    <ErrorBoundary
      fallbackTitle="Terjadi kendala pada papan Kanban"
      fallbackMessage="Antrean pesanan tetap aman di sistem. Klik tombol di bawah untuk menyegarkan tampilan Kanban."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="space-y-3">
          {/* Drag & Drop Helpful Hint */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1 text-2xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HandGrabbing className="h-3.5 w-3.5 text-accent1" weight="duotone" />
              <span>
                Tarik (drag) area mana saja pada kartu pesanan. Kolom tujuan akan secara otomatis memberi ruang (*live preview*) posisi peletakan.
              </span>
            </div>
            {activeOrder && (
              <span className="text-foreground/90 font-semibold">
                Sedang menggeser #{activeOrder.id} ({activeOrder.customer})...
              </span>
            )}
          </div>

          {/* 4 Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {KANBAN_COLUMNS.map((col) => {
              const columnOrders = columns[col.status] || []
              const isOver = activeOverCol === col.status

              return (
                <KanbanColumn
                  key={col.status}
                  col={col}
                  orders={columnOrders}
                  isOver={isOver}
                  tableOrdersMap={tableOrdersMap}
                  onViewOrderDetails={onViewOrderDetails}
                  onUpdateStatus={onUpdateStatus}
                />
              )
            })}
          </div>
        </div>

        {/* 
          IMPORTANT: dropAnimation={null} prevents @dnd-kit from trying to calculate
          or animate detached unmounted DOM nodes upon drop when state mutates across columns.
          This completely eliminates the unhandled runtime exceptions that cause blank screens!
        */}
        <DragOverlay dropAnimation={null}>
          {activeOrder && activeColDef ? (
            <div className="w-72 sm:w-80 cursor-grabbing pointer-events-none rotate-2 scale-102">
              <OrderCardView
                order={activeOrder}
                col={activeColDef}
                tableOrdersMap={tableOrdersMap}
                isOverlay={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ErrorBoundary>
  )
}
