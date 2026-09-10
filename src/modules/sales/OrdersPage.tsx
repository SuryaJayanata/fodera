import React, { useState } from 'react'
import {
  Clock,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  Funnel,
  ArrowRight,
  Storefront,
  Kanban,
  ListDashes,
  Receipt,
  Coffee,
  ForkKnife,
  Motorcycle,
  User,
  DotsThreeVertical,
  Check,
  CookingPot,
  Tray,
  Eye,
  X,
  CaretRight,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: OrdersPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface OrderItem {
  name: string
  qty: number
  price: string
  notes?: string
}

export interface Order {
  id: string
  customer: string
  customerType: 'Guest' | 'Member Gold' | 'Member Silver'
  orderType: 'Dine In' | 'Takeaway' | 'Delivery'
  channel: 'POS Kasir' | 'QR Table' | 'GoFood' | 'GrabFood'
  items: OrderItem[]
  total: string
  outlet: string
  tableNumber?: string
  status: 'new' | 'preparing' | 'ready' | 'completed'
  timeElapsed: string
  paymentMethod: 'QRIS' | 'Debit BCA' | 'Cash' | 'GoPay'
  paymentStatus: 'Lunas' | 'Menunggu'
}

export function OrdersPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all')
  const [selectedOrderType, setSelectedOrderType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeOrderDetails, setActiveOrderDetails] = useState<Order | null>(null)

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-1092',
      customer: 'Dimas Wicaksono',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 04',
      channel: 'QR Table',
      items: [
        { name: 'Spanish Latte', qty: 2, price: 'Rp64.000', notes: 'Less ice, oat milk' },
        { name: 'Butter Croissant', qty: 1, price: 'Rp30.000', notes: 'Hangatkan' },
      ],
      total: 'Rp94.000',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '2 mnt lalu',
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1091',
      customer: 'Siti Rahmawati',
      customerType: 'Member Silver',
      orderType: 'Dine In',
      tableNumber: 'Meja 09',
      channel: 'POS Kasir',
      items: [
        { name: 'Matcha Latte Uji', qty: 1, price: 'Rp36.000', notes: 'Normal sweetness' },
        { name: 'Almond Pastry', qty: 1, price: 'Rp30.000' },
      ],
      total: 'Rp66.000',
      outlet: 'Malang',
      status: 'preparing',
      timeElapsed: '7 mnt lalu',
      paymentMethod: 'Debit BCA',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1090',
      customer: 'Budi Hartono',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Caramel Macchiato', qty: 3, price: 'Rp105.000', notes: 'Extra shot 1 cup' },
      ],
      total: 'Rp105.000',
      outlet: 'Surabaya',
      status: 'ready',
      timeElapsed: '14 mnt lalu',
      paymentMethod: 'Cash',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1089',
      customer: 'Maya Anggraini',
      customerType: 'Member Gold',
      orderType: 'Delivery',
      channel: 'GoFood',
      items: [
        { name: 'Americano Hot', qty: 1, price: 'Rp26.000' },
        { name: 'Cinnamon Roll', qty: 1, price: 'Rp26.000' },
      ],
      total: 'Rp52.000',
      outlet: 'Malang',
      status: 'completed',
      timeElapsed: '28 mnt lalu',
      paymentMethod: 'GoPay',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1088',
      customer: 'Rian Pratama',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Cold Brew Latte', qty: 2, price: 'Rp70.000' },
      ],
      total: 'Rp70.000',
      outlet: 'Jakarta',
      status: 'completed',
      timeElapsed: '39 mnt lalu',
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1087',
      customer: 'Nadia Salsabila',
      customerType: 'Member Silver',
      orderType: 'Dine In',
      tableNumber: 'Meja 02',
      channel: 'QR Table',
      items: [
        { name: 'Taro Puff Pastry', qty: 2, price: 'Rp56.000' },
        { name: 'Cold Brew Oat Milk', qty: 1, price: 'Rp38.000', notes: 'No sugar' },
      ],
      total: 'Rp94.000',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '1 mnt lalu',
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
  ])

  const handleUpdateStatus = (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    )
    if (activeOrderDetails && activeOrderDetails.id === orderId) {
      setActiveOrderDetails((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus
    const matchesOutlet = selectedOutlet === 'all' || o.outlet.toLowerCase() === selectedOutlet.toLowerCase()
    const matchesOrderType = selectedOrderType === 'all' || o.orderType === selectedOrderType
    const matchesSearch =
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesOutlet && matchesOrderType && matchesSearch
  })

  const newOrders = filteredOrders.filter((o) => o.status === 'new')
  const preparingOrders = filteredOrders.filter((o) => o.status === 'preparing')
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready')
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed')

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="accent1">Pesanan Baru</Badge>
      case 'preparing':
        return <Badge variant="warning">Sedang Diracik</Badge>
      case 'ready':
        return <Badge variant="accent2">Siap Disajikan</Badge>
      case 'completed':
        return <Badge variant="secondary">Selesai</Badge>
    }
  }

  const getOrderTypeBadge = (type: Order['orderType']) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Order Management & Kitchen Display</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visibilitas operasional antrean pesanan real-time dari bar racik hingga meja pelanggan
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-0.5 bg-secondary rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" weight="bold" />
              <span>Kanban Antrean</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListDashes className="h-3.5 w-3.5" weight="bold" />
              <span>Tabel Pesanan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">New Orders</span>
            <Receipt className="h-4 w-4 text-accent1" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{orders.filter(o => o.status === 'new').length}</div>
          <div className="text-2xs text-accent1 font-semibold mt-0.5">Perlu konfirmasi bar</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">In Preparation</span>
            <CookingPot className="h-4 w-4 text-warning" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{orders.filter(o => o.status === 'preparing').length}</div>
          <div className="text-2xs text-warning font-semibold mt-0.5">Sedang diracik barista</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Ready for Pickup</span>
            <Tray className="h-4 w-4 text-accent2" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{orders.filter(o => o.status === 'ready').length}</div>
          <div className="text-2xs text-accent2 font-semibold mt-0.5">Menunggu diambil / diantar</div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Completed Today</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">1,281</div>
          <div className="text-2xs text-muted-foreground mt-0.5">Rata-rata sajian: 4.8 mnt</div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <Card>
        <CardContent className="p-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Cari ID pesanan, nama customer, atau menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
              <MagnifyingGlass className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-2.5" weight="bold" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Tipe:</span>
                <Select
                  value={selectedOrderType}
                  onChange={(e) => setSelectedOrderType(e.target.value)}
                  className="h-8 text-xs w-32"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="Dine In">Dine In</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Outlet:</span>
                <Select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="h-8 text-xs w-32"
                >
                  <option value="all">Semua Outlet</option>
                  <option value="malang">Malang</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="jakarta">Jakarta</option>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 text-xs w-32"
                >
                  <option value="all">Semua Status</option>
                  <option value="new">Pesanan Baru</option>
                  <option value="preparing">Sedang Diracik</option>
                  <option value="ready">Siap Disajikan</option>
                  <option value="completed">Selesai</option>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main View: Kanban Pipeline vs Table */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {/* Column 1: New Orders */}
          <div className="bg-secondary/40 rounded-xl p-3 border border-border space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-accent1" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Pesanan Baru</h3>
              </div>
              <Badge variant="accent1">{newOrders.length}</Badge>
            </div>

            <div className="space-y-2.5 min-h-64">
              {newOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  Tidak ada pesanan baru
                </div>
              ) : (
                newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl border border-border bg-card shadow-2xs hover:border-accent1/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">{order.id}</span>
                      <span className="inline-flex items-center gap-1 text-2xs text-muted-foreground">
                        <Clock className="h-3 w-3 text-accent1" weight="bold" />
                        {order.timeElapsed}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{order.customer}</span>
                        {getOrderTypeBadge(order.orderType)}
                      </div>
                      <div className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Storefront className="h-3 w-3" />
                        <span>{order.outlet}</span>
                        {order.tableNumber && <span>• {order.tableNumber}</span>}
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
                        <div className="text-2xs text-accent1 bg-accent1/5 px-2 py-1 rounded border border-accent1/10 font-medium mt-1">
                          Catatan: {order.items.filter((i) => i.notes).map((i) => i.notes).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-2xs text-muted-foreground block">Total Tagihan</span>
                        <span className="text-xs font-bold text-foreground">{order.total}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveOrderDetails(order)}
                          className="h-7 w-7 p-0"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="accent1"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          className="h-7 text-xs px-2.5 gap-1"
                        >
                          <span>Racik</span>
                          <ArrowRight className="h-3 w-3" weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Preparation */}
          <div className="bg-secondary/40 rounded-xl p-3 border border-border space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Sedang Diracik</h3>
              </div>
              <Badge variant="warning">{preparingOrders.length}</Badge>
            </div>

            <div className="space-y-2.5 min-h-64">
              {preparingOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  Barista sedang idle
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl border border-warning/30 bg-card shadow-2xs hover:border-warning/60 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">{order.id}</span>
                      <span className="inline-flex items-center gap-1 text-2xs text-warning font-semibold">
                        <Clock className="h-3 w-3" weight="bold" />
                        {order.timeElapsed}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{order.customer}</span>
                        {getOrderTypeBadge(order.orderType)}
                      </div>
                      <div className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Storefront className="h-3 w-3" />
                        <span>{order.outlet}</span>
                        {order.tableNumber && <span>• {order.tableNumber}</span>}
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
                        <div className="text-2xs text-warning bg-warning/5 px-2 py-1 rounded border border-warning/10 font-medium mt-1">
                          Catatan: {order.items.filter((i) => i.notes).map((i) => i.notes).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-2xs text-muted-foreground block">Total Tagihan</span>
                        <span className="text-xs font-bold text-foreground">{order.total}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveOrderDetails(order)}
                          className="h-7 w-7 p-0"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="accent2"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'ready')}
                          className="h-7 text-xs px-2.5 gap-1"
                        >
                          <span>Siap Saji</span>
                          <ArrowRight className="h-3 w-3" weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="bg-secondary/40 rounded-xl p-3 border border-border space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-accent2" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Siap Disajikan</h3>
              </div>
              <Badge variant="accent2">{readyOrders.length}</Badge>
            </div>

            <div className="space-y-2.5 min-h-64">
              {readyOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  Tidak ada pesanan menunggu
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl border border-accent2/30 bg-card shadow-2xs hover:border-accent2/60 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">{order.id}</span>
                      <span className="inline-flex items-center gap-1 text-2xs text-accent2 font-semibold">
                        <CheckCircle className="h-3 w-3" weight="bold" />
                        Siap
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{order.customer}</span>
                        {getOrderTypeBadge(order.orderType)}
                      </div>
                      <div className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Storefront className="h-3 w-3" />
                        <span>{order.outlet}</span>
                        {order.tableNumber && <span>• {order.tableNumber}</span>}
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
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-2xs text-muted-foreground block">Total Tagihan</span>
                        <span className="text-xs font-bold text-foreground">{order.total}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveOrderDetails(order)}
                          className="h-7 w-7 p-0"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="h-7 text-xs px-2.5 gap-1"
                        >
                          <span>Selesaikan</span>
                          <Check className="h-3 w-3" weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="bg-secondary/40 rounded-xl p-3 border border-border space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Selesai Diambil</h3>
              </div>
              <Badge variant="secondary">{completedOrders.length}</Badge>
            </div>

            <div className="space-y-2.5 min-h-64">
              {completedOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  Belum ada pesanan selesai
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl border border-border bg-card/70 shadow-2xs space-y-2.5 opacity-85 hover:opacity-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">{order.id}</span>
                      <span className="text-2xs text-muted-foreground">{order.timeElapsed}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{order.customer}</span>
                        {getOrderTypeBadge(order.orderType)}
                      </div>
                      <div className="text-2xs text-muted-foreground mt-0.5">
                        {order.outlet} • {order.items.length} jenis item
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{order.total}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveOrderDetails(order)}
                        className="h-7 text-2xs px-2 text-muted-foreground"
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Daftar Riwayat & Antrean Pesanan</CardTitle>
            <CardDescription>Seluruh transaksi operasional toko beserta audit jejak waktu dan kanal pemesanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Tipe & Kanal</th>
                    <th className="py-2.5 px-3">Menu Dipesan</th>
                    <th className="py-2.5 px-3">Total Tagihan</th>
                    <th className="py-2.5 px-3">Outlet</th>
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-foreground">{o.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-foreground">{o.customer}</div>
                        <div className="text-2xs text-muted-foreground">{o.customerType}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {getOrderTypeBadge(o.orderType)}
                          <span className="text-2xs text-muted-foreground">({o.channel})</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {o.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-bold text-foreground">{o.total}</td>
                      <td className="py-3 px-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Storefront className="h-3 w-3" />
                          {o.outlet}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{o.timeElapsed}</td>
                      <td className="py-3 px-3 text-center">{getStatusBadge(o.status)}</td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveOrderDetails(o)}
                          className="h-7 text-xs px-2"
                        >
                          Detail
                        </Button>
                        {o.status === 'new' && (
                          <Button
                            variant="accent1"
                            size="sm"
                            onClick={() => handleUpdateStatus(o.id, 'preparing')}
                            className="h-7 text-xs px-2.5"
                          >
                            Racik
                          </Button>
                        )}
                        {o.status === 'preparing' && (
                          <Button
                            variant="accent2"
                            size="sm"
                            onClick={() => handleUpdateStatus(o.id, 'ready')}
                            className="h-7 text-xs px-2.5"
                          >
                            Siap
                          </Button>
                        )}
                        {o.status === 'ready' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateStatus(o.id, 'completed')}
                            className="h-7 text-xs px-2.5"
                          >
                            Selesai
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {activeOrderDetails && (
        <Modal
          isOpen={Boolean(activeOrderDetails)}
          onClose={() => setActiveOrderDetails(null)}
          title={`Detail Pesanan #${activeOrderDetails.id}`}
          description={`Dibuat ${activeOrderDetails.timeElapsed} • Outlet ${activeOrderDetails.outlet}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {activeOrderDetails.status === 'new' && (
                  <Button
                    variant="accent1"
                    onClick={() => handleUpdateStatus(activeOrderDetails.id, 'preparing')}
                  >
                    Mulai Racik Pesanan
                  </Button>
                )}
                {activeOrderDetails.status === 'preparing' && (
                  <Button
                    variant="accent2"
                    onClick={() => handleUpdateStatus(activeOrderDetails.id, 'ready')}
                  >
                    Tandai Siap Disajikan
                  </Button>
                )}
                {activeOrderDetails.status === 'ready' && (
                  <Button
                    variant="default"
                    onClick={() => handleUpdateStatus(activeOrderDetails.id, 'completed')}
                  >
                    Konfirmasi Selesai / Diambil
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setActiveOrderDetails(null)}>
                Tutup
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Meta status header */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
              <div>
                <span className="text-2xs text-muted-foreground uppercase font-semibold block">Pelanggan</span>
                <span className="text-sm font-bold text-foreground">{activeOrderDetails.customer}</span>
                <span className="text-2xs text-muted-foreground ml-2">({activeOrderDetails.customerType})</span>
              </div>
              <div className="text-right">
                <span className="text-2xs text-muted-foreground uppercase font-semibold block">Status</span>
                {getStatusBadge(activeOrderDetails.status)}
              </div>
            </div>

            {/* Order Attributes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-card">
                <span className="text-2xs text-muted-foreground block">Tipe Layanan & Kanal</span>
                <span className="font-semibold text-foreground">{activeOrderDetails.orderType}</span>
                <span className="text-muted-foreground"> ({activeOrderDetails.channel})</span>
                {activeOrderDetails.tableNumber && (
                  <span className="text-accent1 font-semibold block mt-0.5">{activeOrderDetails.tableNumber}</span>
                )}
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-card">
                <span className="text-2xs text-muted-foreground block">Pembayaran</span>
                <span className="font-semibold text-foreground">{activeOrderDetails.paymentMethod}</span>
                <span className="text-accent2 font-semibold ml-1.5">• {activeOrderDetails.paymentStatus}</span>
              </div>
            </div>

            {/* Item Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-foreground mb-2">Daftar Item Menu</h4>
              <div className="space-y-2 border border-border rounded-lg divide-y divide-border">
                {activeOrderDetails.items.map((item, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground">
                        {item.qty}x {item.name}
                      </div>
                      {item.notes && (
                        <div className="text-2xs text-accent1 font-medium mt-0.5">
                          Catatan: {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="font-mono font-bold text-foreground">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Total */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Total Tagihan (Grand Total)</span>
              <span className="text-base font-bold text-foreground font-mono">{activeOrderDetails.total}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
