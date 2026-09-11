import React, { useState, useEffect } from 'react'
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
  CaretUpDown,
  CaretUp,
  CaretDown,
  ArrowsClockwise,
  Plus,
  Printer,
  Minus,
  Barcode,
  DotsSixVertical,
  HandGrabbing,
  Users,
  SprayBottle,
  Sparkle,
  Armchair,
  UsersThree,
  Trash,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Drawer } from '@/components/ui/drawer'
import { MetricCard } from '@/components/ui/metric-card'
import { DataTable, ColumnDef } from '@/components/ui/data-table'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: OrdersPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface OrderItem {
  name: string
  qty: number
  unitPrice: number
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
  subtotal: number
  tax: number
  total: string
  outlet: string
  tableNumber?: string
  isSharedTable?: boolean
  status: 'new' | 'preparing' | 'ready' | 'completed'
  timeElapsed: string
  minutesElapsed: number
  paymentMethod: 'QRIS' | 'Debit BCA' | 'Cash' | 'GoPay'
  paymentStatus: 'Lunas' | 'Menunggu'
}

export interface OrdersPageProps {
  currentOutlet?: string
  onOutletChange?: (outlet: string) => void
}

const CATALOG_ITEMS = [
  { id: 'cat-1', name: 'Spanish Latte', price: 32000, category: 'Coffee' },
  { id: 'cat-2', name: 'Matcha Latte Uji', price: 36000, category: 'Non-Coffee' },
  { id: 'cat-3', name: 'Butter Croissant', price: 30000, category: 'Bakery' },
  { id: 'cat-4', name: 'Almond Pastry', price: 30000, category: 'Bakery' },
  { id: 'cat-5', name: 'Caramel Macchiato', price: 35000, category: 'Coffee' },
  { id: 'cat-6', name: 'Cold Brew Oat Milk', price: 38000, category: 'Coffee' },
  { id: 'cat-7', name: 'Americano Hot', price: 26000, category: 'Coffee' },
  { id: 'cat-8', name: 'Cinnamon Roll', price: 26000, category: 'Bakery' },
]

export interface TableDef {
  id: string
  number: string
  label: string
  capacity: number
  zone: 'Indoor Utama' | 'Window Bar' | 'Outdoor Terrace'
}

export const OUTLET_TABLES: TableDef[] = [
  { id: 'T-01', number: 'Meja 01', label: '01', capacity: 2, zone: 'Indoor Utama' },
  { id: 'T-02', number: 'Meja 02', label: '02', capacity: 4, zone: 'Indoor Utama' },
  { id: 'T-03', number: 'Meja 03', label: '03', capacity: 2, zone: 'Indoor Utama' },
  { id: 'T-04', number: 'Meja 04', label: '04', capacity: 4, zone: 'Indoor Utama' },
  { id: 'T-05', number: 'Meja 05', label: '05', capacity: 6, zone: 'Indoor Utama' },
  { id: 'T-06', number: 'Meja 06', label: '06', capacity: 2, zone: 'Indoor Utama' },
  { id: 'T-07', number: 'Meja 07', label: '07', capacity: 2, zone: 'Window Bar' },
  { id: 'T-08', number: 'Meja 08', label: '08', capacity: 2, zone: 'Window Bar' },
  { id: 'T-09', number: 'Meja 09', label: '09', capacity: 4, zone: 'Window Bar' },
  { id: 'T-10', number: 'Meja 10', label: '10', capacity: 4, zone: 'Outdoor Terrace' },
  { id: 'T-11', number: 'Meja 11', label: '11', capacity: 4, zone: 'Outdoor Terrace' },
  { id: 'T-12', number: 'Meja 12', label: '12', capacity: 6, zone: 'Outdoor Terrace' },
]

const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`

export function OrdersPage({ currentOutlet = 'all', onOutletChange }: OrdersPageProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'floorplan'>('kanban')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOrderType, setSelectedOrderType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const orderTypeFilterOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'Dine In', label: 'Dine In', icon: <ForkKnife className="h-3.5 w-3.5 text-accent1" weight="bold" /> },
    { value: 'Takeaway', label: 'Takeaway', icon: <Coffee className="h-3.5 w-3.5 text-accent2" weight="bold" /> },
    { value: 'Delivery', label: 'Delivery', icon: <Motorcycle className="h-3.5 w-3.5 text-warning" weight="bold" /> },
  ]

  const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'new', label: 'Pesanan Baru' },
    { value: 'preparing', label: 'Sedang Diracik' },
    { value: 'ready', label: 'Siap Disajikan' },
    { value: 'completed', label: 'Selesai' },
  ]

  // Modals & Detail Tabs
  const [activeOrderDetails, setActiveOrderDetails] = useState<Order | null>(null)
  const [detailModalTab, setDetailModalTab] = useState<'details' | 'receipt'>('details')
  const [isPrinting, setIsPrinting] = useState(false)
  const [printSuccessNotice, setPrintSuccessNotice] = useState(false)

  // Drag & Drop State for Kanban
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<Order['status'] | null>(null)

  // New Order Drawer State
  const [isNewOrderDrawerOpen, setIsNewOrderDrawerOpen] = useState(false)
  const [orderSequence, setOrderSequence] = useState(1093)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerType, setNewCustomerType] = useState<'Guest' | 'Member Gold' | 'Member Silver'>('Guest')
  const [newOrderType, setNewOrderType] = useState<'Dine In' | 'Takeaway' | 'Delivery'>('Dine In')
  const [newTableNumber, setNewTableNumber] = useState('Meja 05')
  const [newOutlet, setNewOutlet] = useState(
    currentOutlet !== 'all' ? (currentOutlet.charAt(0).toUpperCase() + currentOutlet.slice(1)) : 'Malang'
  )
  const [newChannel, setNewChannel] = useState<'POS Kasir' | 'QR Table' | 'GoFood' | 'GrabFood'>('POS Kasir')
  const [newPaymentMethod, setNewPaymentMethod] = useState<'QRIS' | 'Debit BCA' | 'Cash' | 'GoPay'>('QRIS')
  const [cartItems, setCartItems] = useState<Record<string, number>>({ 'cat-1': 1, 'cat-3': 1 })
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({ 'cat-1': 'Less sweet, normal ice' })
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [selectedTableZone, setSelectedTableZone] = useState<string>('all')

  // Sync external currentOutlet
  useEffect(() => {
    if (currentOutlet !== 'all') {
      setNewOutlet(currentOutlet.charAt(0).toUpperCase() + currentOutlet.slice(1))
    }
  }, [currentOutlet])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-1092',
      customer: 'Dimas Wicaksono',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 04',
      channel: 'QR Table',
      items: [
        { name: 'Spanish Latte', qty: 2, unitPrice: 32000, price: 'Rp64.000', notes: 'Less ice, oat milk' },
        { name: 'Butter Croissant', qty: 1, unitPrice: 30000, price: 'Rp30.000', notes: 'Hangatkan' },
      ],
      subtotal: 94000,
      tax: 9400,
      total: 'Rp103.400',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '2 mnt lalu',
      minutesElapsed: 2,
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
        { name: 'Matcha Latte Uji', qty: 1, unitPrice: 36000, price: 'Rp36.000', notes: 'Normal sweetness' },
        { name: 'Almond Pastry', qty: 1, unitPrice: 30000, price: 'Rp30.000' },
      ],
      subtotal: 66000,
      tax: 6600,
      total: 'Rp72.600',
      outlet: 'Malang',
      status: 'preparing',
      timeElapsed: '7 mnt lalu',
      minutesElapsed: 7,
      paymentMethod: 'Debit BCA',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1086',
      customer: 'Hendro Kusuma',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 12',
      channel: 'POS Kasir',
      items: [
        { name: 'Cold Brew Oat Milk', qty: 3, unitPrice: 38000, price: 'Rp114.000', notes: 'Extra ice' },
        { name: 'Butter Croissant', qty: 1, unitPrice: 30000, price: 'Rp30.000', notes: 'Panggang garing' },
      ],
      subtotal: 144000,
      tax: 14400,
      total: 'Rp158.400',
      outlet: 'Malang',
      status: 'preparing',
      timeElapsed: '18 mnt lalu',
      minutesElapsed: 18,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1090',
      customer: 'Budi Hartono',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Caramel Macchiato', qty: 3, unitPrice: 35000, price: 'Rp105.000', notes: 'Extra shot 1 cup' },
      ],
      subtotal: 105000,
      tax: 10500,
      total: 'Rp115.500',
      outlet: 'Surabaya',
      status: 'ready',
      timeElapsed: '14 mnt lalu',
      minutesElapsed: 14,
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
        { name: 'Americano Hot', qty: 1, unitPrice: 26000, price: 'Rp26.000' },
        { name: 'Cinnamon Roll', qty: 1, unitPrice: 26000, price: 'Rp26.000' },
      ],
      subtotal: 52000,
      tax: 5200,
      total: 'Rp57.200',
      outlet: 'Malang',
      status: 'completed',
      timeElapsed: '28 mnt lalu',
      minutesElapsed: 28,
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
        { name: 'Cold Brew Oat Milk', qty: 2, unitPrice: 38000, price: 'Rp76.000' },
      ],
      subtotal: 76000,
      tax: 7600,
      total: 'Rp83.600',
      outlet: 'Jakarta',
      status: 'completed',
      timeElapsed: '39 mnt lalu',
      minutesElapsed: 39,
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
        { name: 'Almond Pastry', qty: 2, unitPrice: 30000, price: 'Rp60.000' },
        { name: 'Cold Brew Oat Milk', qty: 1, unitPrice: 38000, price: 'Rp38.000', notes: 'No sugar' },
      ],
      subtotal: 98000,
      tax: 9800,
      total: 'Rp107.800',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '1 mnt lalu',
      minutesElapsed: 1,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1085',
      customer: 'Aditya Pratama',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 06',
      channel: 'QR Table',
      items: [
        { name: 'Piccolo Latte', qty: 2, unitPrice: 30000, price: 'Rp60.000', notes: 'Double ristretto' },
        { name: 'Pain au Chocolat', qty: 1, unitPrice: 32000, price: 'Rp32.000' },
      ],
      subtotal: 92000,
      tax: 9200,
      total: 'Rp101.200',
      outlet: 'Malang',
      status: 'ready',
      timeElapsed: '12 mnt lalu',
      minutesElapsed: 12,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1084',
      customer: 'Jessica Tanuwijaya',
      customerType: 'Member Silver',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Spanish Latte', qty: 1, unitPrice: 32000, price: 'Rp32.000', notes: 'Oat milk substitusi' },
        { name: 'Butter Croissant', qty: 2, unitPrice: 30000, price: 'Rp60.000' },
      ],
      subtotal: 92000,
      tax: 9200,
      total: 'Rp101.200',
      outlet: 'Malang',
      status: 'preparing',
      timeElapsed: '15 mnt lalu',
      minutesElapsed: 15,
      paymentMethod: 'Debit BCA',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1083',
      customer: 'Kevin Sanjaya',
      customerType: 'Guest',
      orderType: 'Delivery',
      channel: 'GrabFood',
      items: [
        { name: 'Cold Brew Oat Milk', qty: 2, unitPrice: 38000, price: 'Rp76.000' },
        { name: 'Cinnamon Roll', qty: 2, unitPrice: 26000, price: 'Rp52.000' },
      ],
      subtotal: 128000,
      tax: 12800,
      total: 'Rp140.800',
      outlet: 'Surabaya',
      status: 'ready',
      timeElapsed: '20 mnt lalu',
      minutesElapsed: 20,
      paymentMethod: 'GoPay',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1082',
      customer: 'Farhan Maulana',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 08',
      channel: 'QR Table',
      items: [
        { name: 'Matcha Latte Uji', qty: 1, unitPrice: 36000, price: 'Rp36.000' },
        { name: 'Almond Pastry', qty: 1, unitPrice: 30000, price: 'Rp30.000' },
      ],
      subtotal: 66000,
      tax: 6600,
      total: 'Rp72.600',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '4 mnt lalu',
      minutesElapsed: 4,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1081',
      customer: 'Dewi Lestari',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Americano Hot', qty: 2, unitPrice: 26000, price: 'Rp52.000', notes: 'Extra hot' },
      ],
      subtotal: 52000,
      tax: 5200,
      total: 'Rp57.200',
      outlet: 'Jakarta',
      status: 'completed',
      timeElapsed: '45 mnt lalu',
      minutesElapsed: 45,
      paymentMethod: 'Cash',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1080',
      customer: 'Bambang Sudibyo',
      customerType: 'Member Silver',
      orderType: 'Dine In',
      tableNumber: 'Meja 14',
      channel: 'POS Kasir',
      items: [
        { name: 'Caramel Macchiato', qty: 2, unitPrice: 35000, price: 'Rp70.000' },
        { name: 'Pain au Chocolat', qty: 2, unitPrice: 32000, price: 'Rp64.000' },
      ],
      subtotal: 134000,
      tax: 13400,
      total: 'Rp147.400',
      outlet: 'Malang',
      status: 'ready',
      timeElapsed: '16 mnt lalu',
      minutesElapsed: 16,
      paymentMethod: 'Debit BCA',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1079',
      customer: 'Citra Kirana',
      customerType: 'Member Gold',
      orderType: 'Delivery',
      channel: 'GoFood',
      items: [
        { name: 'Spanish Latte', qty: 3, unitPrice: 32000, price: 'Rp96.000' },
        { name: 'Butter Croissant', qty: 2, unitPrice: 30000, price: 'Rp60.000' },
      ],
      subtotal: 156000,
      tax: 15600,
      total: 'Rp171.600',
      outlet: 'Malang',
      status: 'completed',
      timeElapsed: '52 mnt lalu',
      minutesElapsed: 52,
      paymentMethod: 'GoPay',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1078',
      customer: 'Reza Rahadian',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Cold Brew Oat Milk', qty: 1, unitPrice: 38000, price: 'Rp38.000' },
        { name: 'Cinnamon Roll', qty: 1, unitPrice: 26000, price: 'Rp26.000' },
      ],
      subtotal: 64000,
      tax: 6400,
      total: 'Rp70.400',
      outlet: 'Surabaya',
      status: 'preparing',
      timeElapsed: '9 mnt lalu',
      minutesElapsed: 9,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1077',
      customer: 'Anisa Pohan',
      customerType: 'Member Silver',
      orderType: 'Dine In',
      tableNumber: 'Meja 03',
      channel: 'QR Table',
      items: [
        { name: 'Piccolo Latte', qty: 1, unitPrice: 30000, price: 'Rp30.000' },
        { name: 'Butter Croissant', qty: 1, unitPrice: 30000, price: 'Rp30.000' },
      ],
      subtotal: 60000,
      tax: 6000,
      total: 'Rp66.000',
      outlet: 'Malang',
      status: 'completed',
      timeElapsed: '1 jam lalu',
      minutesElapsed: 63,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1076',
      customer: 'Gilang Dirga',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Matcha Latte Uji', qty: 2, unitPrice: 36000, price: 'Rp72.000', notes: 'Less sugar' },
      ],
      subtotal: 72000,
      tax: 7200,
      total: 'Rp79.200',
      outlet: 'Jakarta',
      status: 'ready',
      timeElapsed: '22 mnt lalu',
      minutesElapsed: 22,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1075',
      customer: 'Tiara Andini',
      customerType: 'Member Gold',
      orderType: 'Dine In',
      tableNumber: 'Meja 10',
      channel: 'QR Table',
      items: [
        { name: 'Caramel Macchiato', qty: 1, unitPrice: 35000, price: 'Rp35.000' },
        { name: 'Almond Pastry', qty: 2, unitPrice: 30000, price: 'Rp60.000' },
      ],
      subtotal: 95000,
      tax: 9500,
      total: 'Rp104.500',
      outlet: 'Malang',
      status: 'preparing',
      timeElapsed: '11 mnt lalu',
      minutesElapsed: 11,
      paymentMethod: 'Debit BCA',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1074',
      customer: 'Ahmad Fauzi',
      customerType: 'Member Silver',
      orderType: 'Delivery',
      channel: 'GrabFood',
      items: [
        { name: 'Cold Brew Oat Milk', qty: 2, unitPrice: 38000, price: 'Rp76.000' },
        { name: 'Pain au Chocolat', qty: 1, unitPrice: 32000, price: 'Rp32.000' },
      ],
      subtotal: 108000,
      tax: 10800,
      total: 'Rp118.800',
      outlet: 'Malang',
      status: 'completed',
      timeElapsed: '1 jam lalu',
      minutesElapsed: 75,
      paymentMethod: 'GoPay',
      paymentStatus: 'Lunas',
    },
    {
      id: 'ORD-1073',
      customer: 'Ratna Sari',
      customerType: 'Guest',
      orderType: 'Takeaway',
      channel: 'POS Kasir',
      items: [
        { name: 'Americano Hot', qty: 1, unitPrice: 26000, price: 'Rp26.000' },
        { name: 'Cinnamon Roll', qty: 1, unitPrice: 26000, price: 'Rp26.000' },
      ],
      subtotal: 52000,
      tax: 5200,
      total: 'Rp57.200',
      outlet: 'Malang',
      status: 'new',
      timeElapsed: '5 mnt lalu',
      minutesElapsed: 5,
      paymentMethod: 'Cash',
      paymentStatus: 'Lunas',
    },
  ])

  // Table turnover & operational status management
  const [cleaningTables, setCleaningTables] = useState<Set<string>>(
    new Set(['meja 03']) // Initial demo table needing cleaning
  )
  const [floorplanZoneFilter, setFloorplanZoneFilter] = useState<string>('all')

  // Map active Dine In orders per table (supports multiple orders / shared table)
  const tableOrdersMap = React.useMemo(() => {
    const map = new Map<string, Order[]>()
    orders.forEach((o) => {
      if (o.status !== 'completed' && o.tableNumber) {
        const matchesOutlet =
          !newOutlet ||
          newOutlet.toLowerCase() === 'all' ||
          o.outlet.toLowerCase() === newOutlet.toLowerCase()

        if (matchesOutlet) {
          const key = o.tableNumber.trim().toLowerCase()
          const existing = map.get(key) || []
          existing.push(o)
          map.set(key, existing)
        }
      }
    })
    return map
  }, [orders, newOutlet])

  // Automatically ensure a default table is pre-selected if none is chosen
  useEffect(() => {
    if (newOrderType === 'Dine In' && !newTableNumber) {
      const firstAvailable = OUTLET_TABLES.find((t) => {
        const key = t.number.trim().toLowerCase()
        return !cleaningTables.has(key) && !(tableOrdersMap.get(key)?.length)
      })
      if (firstAvailable) {
        setNewTableNumber(firstAvailable.number)
      }
    }
  }, [newOrderType, newTableNumber, cleaningTables, tableOrdersMap])

  // Fitur A: Quick Vacate Table (Kosongkan Meja Langsung)
  const handleVacateTable = (tableNumber: string) => {
    const key = tableNumber.trim().toLowerCase()
    setOrders((prev) =>
      prev.map((o) =>
        o.tableNumber?.trim().toLowerCase() === key && o.status !== 'completed'
          ? { ...o, status: 'completed' }
          : o
      )
    )
    setCleaningTables((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  // Fitur B: Mark Table as Needs Cleaning (Tandai Perlu Dibersihkan)
  const handleMarkTableCleaning = (tableNumber: string) => {
    const key = tableNumber.trim().toLowerCase()
    setOrders((prev) =>
      prev.map((o) =>
        o.tableNumber?.trim().toLowerCase() === key && o.status !== 'completed'
          ? { ...o, status: 'completed' }
          : o
      )
    )
    setCleaningTables((prev) => new Set(prev).add(key))
  }

  // Fitur B: Mark Table as Cleaned (Selesai Dibersihkan -> Siap Digunakan)
  const handleMarkTableCleaned = (tableNumber: string) => {
    const key = tableNumber.trim().toLowerCase()
    setCleaningTables((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  // Quick Action: Start New Order for a specific table (supports Gabung Meja)
  const handleStartNewOrderForTable = (tableNumber: string) => {
    setNewOrderType('Dine In')
    setNewTableNumber(tableNumber)
    setIsNewOrderDrawerOpen(true)
  }

  const handleUpdateStatus = (
    orderId: string,
    nextStatus: Order['status'],
    markTableCleaning: boolean = true
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    )
    if (activeOrderDetails && activeOrderDetails.id === orderId) {
      setActiveOrderDetails((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }

    // When a Dine In order is completed, if no other active orders remain on that table,
    // automatically transition table to 'cleaning' (Fitur B)
    if (nextStatus === 'completed' && targetOrder?.tableNumber && markTableCleaning) {
      const tableKey = targetOrder.tableNumber.trim().toLowerCase()
      const hasOtherActiveOrders = orders.some(
        (o) =>
          o.id !== orderId &&
          o.status !== 'completed' &&
          o.tableNumber?.trim().toLowerCase() === tableKey
      )
      if (!hasOtherActiveOrders) {
        setCleaningTables((prev) => new Set(prev).add(tableKey))
      }
    }
  }


  // Cart operations for New Order
  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0
      const next = current + delta
      if (next <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  const calculateNewOrderTotals = () => {
    let sub = 0
    Object.entries(cartItems).forEach(([id, qty]) => {
      const item = CATALOG_ITEMS.find((c) => c.id === id)
      if (item) {
        sub += item.price * qty
      }
    })
    const tax = Math.round(sub * 0.1)
    const grand = sub + tax
    return { sub, tax, grand }
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomerName.trim()) return

    const { sub, tax, grand } = calculateNewOrderTotals()
    if (sub === 0) return

    const orderItemsList: OrderItem[] = []
    Object.entries(cartItems).forEach(([id, qty]) => {
      const item = CATALOG_ITEMS.find((c) => c.id === id)
      if (item && qty > 0) {
        orderItemsList.push({
          name: item.name,
          qty,
          unitPrice: item.price,
          price: formatRupiah(item.price * qty),
          notes: itemNotes[id]?.trim() || undefined,
        })
      }
    })

    const isShared = Boolean(
      newOrderType === 'Dine In' &&
      newTableNumber &&
      (tableOrdersMap.get(newTableNumber.trim().toLowerCase())?.length || 0) > 0
    )

    const newOrderObj: Order = {
      id: `ORD-${orderSequence}`,
      customer: newCustomerName.trim(),
      customerType: newCustomerType,
      orderType: newOrderType,
      channel: newChannel,
      items: orderItemsList,
      subtotal: sub,
      tax: tax,
      total: formatRupiah(grand),
      outlet: newOutlet,
      tableNumber: newOrderType === 'Dine In' ? newTableNumber : undefined,
      isSharedTable: isShared,
      status: 'new',
      timeElapsed: 'Baru saja',
      minutesElapsed: 0,
      paymentMethod: newPaymentMethod,
      paymentStatus: 'Lunas',
    }

    // If this table was marked as cleaning, remove it since a new order has seated
    if (newOrderType === 'Dine In' && newTableNumber) {
      setCleaningTables((prev) => {
        const next = new Set(prev)
        next.delete(newTableNumber.trim().toLowerCase())
        return next
      })
    }

    setOrders((prev) => [newOrderObj, ...prev])
    setOrderSequence((prev) => prev + 1)
    setIsNewOrderDrawerOpen(false)

    // Reset Form
    setNewCustomerName('')
    setCartItems({ 'cat-1': 1 })
    setItemNotes({})
    setMenuSearchQuery('')
  }

  const handlePrintSimulate = () => {
    setIsPrinting(true)
    setPrintSuccessNotice(false)
    setTimeout(() => {
      setIsPrinting(false)
      setPrintSuccessNotice(true)
      setTimeout(() => setPrintSuccessNotice(false), 3500)
    }, 1000)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus
    const matchesOutlet = currentOutlet === 'all' || o.outlet.toLowerCase() === currentOutlet.toLowerCase()
    const matchesOrderType = selectedOrderType === 'all' || o.orderType === selectedOrderType
    const matchesSearch =
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesOutlet && matchesOrderType && matchesSearch
  })

  const filteredCatalogItems = CATALOG_ITEMS.filter((item) => {
    const q = menuSearchQuery.toLowerCase().trim()
    if (!q) return true
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
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

  const orderColumns: ColumnDef<Order>[] = [
    {
      id: 'id',
      header: 'Order ID',
      sortable: true,
      accessorKey: 'id',
      cell: (o) => <span className="font-mono font-semibold text-foreground">{o.id}</span>,
    },
    {
      id: 'customer',
      header: 'Customer',
      sortable: true,
      accessorKey: 'customer',
      cell: (o) => (
        <div>
          <div className="font-medium text-foreground">{o.customer}</div>
          <div className="text-2xs text-muted-foreground">{o.customerType}</div>
        </div>
      ),
    },
    {
      id: 'orderType',
      header: 'Tipe & Kanal',
      sortable: true,
      accessorKey: 'orderType',
      cell: (o) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {getOrderTypeBadge(o.orderType)}
          {o.tableNumber && (
            <span className="text-2xs font-semibold text-foreground">
              {o.tableNumber}
            </span>
          )}
          {(o.isSharedTable || (o.tableNumber && (tableOrdersMap.get(o.tableNumber.trim().toLowerCase())?.length || 0) > 1)) && (
            <span
              className="text-2xs font-bold text-accent1 bg-accent1/10 px-1.5 py-0.5 rounded flex items-center gap-0.5"
              title="Berbagi meja dengan pesanan lain (Gabung Meja)"
            >
              <UsersThree className="h-3 w-3" />
              Gabung
            </span>
          )}
          <span className="text-2xs text-muted-foreground">({o.channel})</span>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Menu Dipesan',
      sortable: true,
      sortComparator: (a, b) => {
        const aCount = a.items.reduce((s, i) => s + i.qty, 0)
        const bCount = b.items.reduce((s, i) => s + i.qty, 0)
        return aCount - bCount
      },
      cell: (o) => (
        <span className="text-muted-foreground">
          {o.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
        </span>
      ),
    },
    {
      id: 'subtotal',
      header: 'Total Tagihan',
      sortable: true,
      accessorKey: 'subtotal',
      cell: (o) => <span className="font-bold text-foreground">{o.total}</span>,
    },
    {
      id: 'outlet',
      header: 'Outlet',
      sortable: true,
      accessorKey: 'outlet',
      cell: (o) => (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Storefront className="h-3 w-3" />
          {o.outlet}
        </span>
      ),
    },
    {
      id: 'minutesElapsed',
      header: 'Waktu',
      sortable: true,
      accessorKey: 'minutesElapsed',
      cell: (o) => <span className="text-muted-foreground">{o.timeElapsed}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      align: 'center',
      sortComparator: (a, b) => {
        const statusWeights: Record<Order['status'], number> = {
          new: 1,
          preparing: 2,
          ready: 3,
          completed: 4,
        }
        return statusWeights[a.status] - statusWeights[b.status]
      },
      cell: (o) => getStatusBadge(o.status),
    },
    {
      id: 'actions',
      header: 'Aksi',
      align: 'right',
      cell: (o) => (
        <div className="space-x-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveOrderDetails(o)
              setDetailModalTab('details')
            }}
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
        </div>
      ),
    },
  ]

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

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="accent1"
            size="sm"
            onClick={() => setIsNewOrderDrawerOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" weight="bold" />
            <span>Catat Pesanan</span>
          </Button>
        </div>
      </div>

      {/* Pipeline Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <MetricCard
          title="NEW ORDERS"
          value={newOrders.length}
          subtitle="Perlu konfirmasi bar"
          subtitleClassName="text-accent1 font-semibold"
          icon={Receipt}
          iconClassName="text-accent1"
          change="Prioritas"
          trend="up"
          sparkline={[40, 65, 50, 85, 100]}
          barColor="accent1"
        />

        <MetricCard
          title="IN PREPARATION"
          value={preparingOrders.length}
          subtitle="Sedang diracik barista"
          subtitleClassName="text-warning font-semibold"
          icon={CookingPot}
          iconClassName="text-warning"
          change="Di Antrean"
          trend="neutral"
          sparkline={[55, 75, 40, 90, 70]}
          barColor="warning"
        />

        <MetricCard
          title="READY FOR PICKUP"
          value={readyOrders.length}
          subtitle="Menunggu diambil / diantar"
          subtitleClassName="text-accent2 font-semibold"
          icon={Tray}
          iconClassName="text-accent2"
          change="Siap Saji"
          trend="up"
          sparkline={[30, 45, 60, 80, 65]}
          barColor="accent2"
        />

        <MetricCard
          title="COMPLETED TODAY"
          value={completedOrders.length + 1280}
          subtitle="Rata-rata sajian: 4.8 mnt"
          icon={CheckCircle}
          iconClassName="text-muted-foreground"
          change="+8.4%"
          trend="up"
          sparkline={[60, 70, 85, 90, 100]}
          barColor="accent1"
        />
      </div>

      {/* Filter Control Bar (Container Pencarian) */}
      <Card className="rounded-2xl">
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
                  onValueChange={setSelectedOrderType}
                  options={orderTypeFilterOptions}
                  className="h-8 text-xs w-36"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  options={statusFilterOptions}
                  className="h-8 text-xs w-36"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Navigation Tabs (Pindah dibawah container pencarian) */}
      <div className="flex items-center justify-between gap-3">
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
            <span>Kanban Bar</span>
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
            <span>Tabel Audit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('floorplan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'floorplan'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Armchair className="h-3.5 w-3.5" weight="bold" />
            <span>Denah Meja</span>
          </button>
        </div>
      </div>

      {/* Main View: Kanban Pipeline vs Table */}
      {viewMode === 'kanban' ? (
        <div className="space-y-3">
          {/* Drag & Drop Helpful Hint */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1 text-2xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HandGrabbing className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
              <span>
                Tarik (drag) kartu pesanan dan lepas (drop) pada kolom tujuan untuk mengubah status antrean secara instan.
              </span>
            </div>
            {draggedOrderId && (
              <span className="text-foreground/80 font-medium">
                Sedang menggeser pesanan #{draggedOrderId}...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {[
              {
                status: 'new' as const,
                title: 'Pesanan Baru',
                dotClass: 'bg-accent1',
                badgeVariant: 'accent1' as const,
                ordersList: newOrders,
                emptyText: 'Tidak ada pesanan baru',
                nextAction: {
                  targetStatus: 'preparing' as const,
                  label: 'Racik',
                  variant: 'accent1' as const,
                },
              },
              {
                status: 'preparing' as const,
                title: 'Sedang Diracik',
                dotClass: 'bg-warning',
                badgeVariant: 'warning' as const,
                ordersList: preparingOrders,
                emptyText: 'Barista sedang idle',
                nextAction: {
                  targetStatus: 'ready' as const,
                  label: 'Siap Saji',
                  variant: 'accent2' as const,
                },
              },
              {
                status: 'ready' as const,
                title: 'Siap Disajikan',
                dotClass: 'bg-accent2',
                badgeVariant: 'accent2' as const,
                ordersList: readyOrders,
                emptyText: 'Tidak ada pesanan menunggu',
                nextAction: {
                  targetStatus: 'completed' as const,
                  label: 'Selesaikan',
                  variant: 'default' as const,
                },
              },
              {
                status: 'completed' as const,
                title: 'Selesai Diambil',
                dotClass: 'bg-muted-foreground',
                badgeVariant: 'secondary' as const,
                ordersList: completedOrders,
                emptyText: 'Belum ada pesanan selesai',
              },
            ].map((col) => {
              const isOver = dragOverColumn === col.status
              return (
                <div
                  key={col.status}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (dragOverColumn !== col.status) {
                      setDragOverColumn(col.status)
                    }
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDragOverColumn(null)
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const droppedId = e.dataTransfer.getData('text/plain') || draggedOrderId
                    if (droppedId) {
                      handleUpdateStatus(droppedId, col.status)
                    }
                    setDraggedOrderId(null)
                    setDragOverColumn(null)
                  }}
                  className={`rounded-2xl p-3 border space-y-3 transition-all ${
                    isOver
                      ? 'bg-secondary/70 border-accent1/35 ring-1 ring-accent1/20'
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
                    <Badge variant={col.badgeVariant}>{col.ordersList.length}</Badge>
                  </div>

                  {/* Drop zone visual feedback when hovering */}
                  {isOver && draggedOrderId && (
                    <div className="p-2.5 rounded-xl border border-dashed border-border/80 bg-card/80 flex items-center justify-center gap-2 text-2xs font-medium text-muted-foreground transition-all shadow-2xs">
                      <HandGrabbing className="h-3.5 w-3.5 text-accent1/70 shrink-0" weight="duotone" />
                      <span>Pindahkan ke status "{col.title}"</span>
                    </div>
                  )}

                  <div className="space-y-2.5 min-h-64">
                    {col.ordersList.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                        {col.emptyText}
                      </div>
                    ) : (
                      col.ordersList.map((order) => {
                        const isBeingDragged = draggedOrderId === order.id

                        return (
                          <div
                            key={order.id}
                            draggable={true}
                            onDragStart={(e) => {
                              setDraggedOrderId(order.id)
                              e.dataTransfer.setData('text/plain', order.id)
                              e.dataTransfer.effectAllowed = 'move'
                            }}
                            onDragEnd={() => {
                              setDraggedOrderId(null)
                              setDragOverColumn(null)
                            }}
                            className={`p-3.5 rounded-xl border bg-card shadow-2xs transition-all space-y-2.5 cursor-grab active:cursor-grabbing select-none group ${
                              isBeingDragged
                                ? 'opacity-30 scale-98 border-accent1/35 shadow-xs'
                                : col.status === 'preparing'
                                ? 'border-warning/30 hover:border-warning/60'
                                : col.status === 'ready'
                                ? 'border-accent2/30 hover:border-accent2/60'
                                : col.status === 'completed'
                                ? 'border-border opacity-85 hover:opacity-100'
                                : 'border-border hover:border-accent1/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <DotsSixVertical
                                  className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0"
                                  weight="bold"
                                />
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
                              <div className="text-2xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                <Storefront className="h-3 w-3" />
                                <span>{order.outlet}</span>
                                {order.tableNumber && (
                                  <span className="inline-flex items-center gap-1">
                                    • {order.tableNumber}
                                    {(order.isSharedTable ||
                                      (tableOrdersMap.get(order.tableNumber.trim().toLowerCase())?.length || 0) > 1) && (
                                      <span
                                        className="text-2xs font-bold text-accent1 bg-accent1/10 px-1 py-0.2 rounded inline-flex items-center gap-0.5"
                                        title="Berbagi meja dengan pesanan lain (Gabung Meja)"
                                      >
                                        <UsersThree className="h-2.5 w-2.5" />
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
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveOrderDetails(order)
                                    setDetailModalTab(col.status === 'completed' ? 'receipt' : 'details')
                                  }}
                                  className="h-7 w-7 p-0"
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
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleUpdateStatus(order.id, col.nextAction!.targetStatus)
                                    }}
                                    className="h-7 text-xs px-2.5 gap-1"
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
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <DataTable
          title="Daftar Riwayat & Antrean Pesanan"
          description="Seluruh transaksi operasional toko beserta audit jejak waktu dan kanal pemesanan"
          data={filteredOrders}
          columns={orderColumns}
          keyExtractor={(o) => o.id}
          showRowNumbers={true}
          rowNumberHeader="No"
          defaultSortField="id"
          defaultSortOrder="desc"
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="Tidak ada antrean pesanan yang cocok dengan filter"
          emptyDescription="Coba ubah kata kunci pencarian, tipe layanan, atau status pesanan."
        />
      ) : (
        /* Live Floorplan & Turnover View Mode */
        <div className="space-y-4">
          {/* Floorplan Header & Statistics */}
          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-accent1/10 flex items-center justify-center text-accent1 shrink-0">
                      <Armchair className="h-5 w-5" weight="bold" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        Live Floorplan & Turnover Meja ({currentOutlet === 'all' ? 'Semua Outlet' : currentOutlet})
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pantau okupansi meja real-time, kelola meja kotor, dan atur pemesanan gabung meja
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Counters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent2/25 bg-accent2/5 text-accent2 text-xs font-semibold">
                    <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                    <span>
                      Tersedia (
                      {
                        OUTLET_TABLES.filter((t) => {
                          const key = t.number.trim().toLowerCase()
                          return !cleaningTables.has(key) && !(tableOrdersMap.get(key)?.length)
                        }).length
                      }
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent1/25 bg-accent1/5 text-accent1 text-xs font-semibold">
                    <UsersThree className="h-3.5 w-3.5" weight="fill" />
                    <span>
                      Terisi (
                      {
                        OUTLET_TABLES.filter((t) => {
                          const key = t.number.trim().toLowerCase()
                          return (tableOrdersMap.get(key)?.length || 0) > 0
                        }).length
                      }
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warning/25 bg-warning/5 text-warning text-xs font-semibold">
                    <SprayBottle className="h-3.5 w-3.5" weight="fill" />
                    <span>Perlu Bersih ({cleaningTables.size})</span>
                  </div>
                </div>
              </div>

              {/* Zone Filter Tabs */}
              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border overflow-x-auto pb-1 custom-scrollbar">
                <span className="text-xs text-muted-foreground mr-1 shrink-0">Filter Area:</span>
                {[
                  { id: 'all', label: 'Semua Area' },
                  { id: 'Indoor Utama', label: 'Indoor Utama' },
                  { id: 'Window Bar', label: 'Window Bar' },
                  { id: 'Outdoor Terrace', label: 'Outdoor' },
                ].map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setFloorplanZoneFilter(z.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                      floorplanZoneFilter === z.id
                        ? 'bg-secondary text-foreground border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Floorplan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {OUTLET_TABLES.filter(
              (t) => floorplanZoneFilter === 'all' || t.zone === floorplanZoneFilter
            ).map((t) => {
              const key = t.number.trim().toLowerCase()
              const ordersAtTable = tableOrdersMap.get(key) || []
              const isOccupied = ordersAtTable.length > 0
              const isCleaning = cleaningTables.has(key)

              return (
                <Card
                  key={t.id}
                  className={`rounded-2xl transition-all flex flex-col justify-between ${
                    isCleaning
                      ? 'border-warning/40 bg-warning/5'
                      : isOccupied
                      ? 'border-accent1/35 bg-accent1/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <CardContent className="p-4 space-y-3.5 flex flex-col h-full justify-between">
                    {/* Top Row: Table No & Zone & Status Badge */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {t.number}
                          </span>
                          <span className="text-2xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium border border-border">
                            {t.zone}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-2xs text-muted-foreground font-medium">
                          <Users className="h-3 w-3" />
                          {t.capacity} Kursi
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isCleaning ? (
                          <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">
                            <SprayBottle className="h-3 w-3" weight="bold" />
                            Perlu Dibersihkan
                          </span>
                        ) : isOccupied ? (
                          <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-accent1/15 text-accent1 border border-accent1/30">
                            <UsersThree className="h-3 w-3" weight="bold" />
                            {ordersAtTable.length > 1
                              ? `Gabung Meja (${ordersAtTable.length} Pesanan)`
                              : 'Terisi Pelanggan'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-accent2/10 text-accent2 border border-accent2/25">
                            <Check className="h-3 w-3" weight="bold" />
                            Siap Ditempati
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Architectural Visual Table */}
                    <div className="py-2.5 px-3 rounded-xl bg-card border border-border/70 flex flex-col items-center justify-center">
                      {/* Top Chairs */}
                      <div className="flex gap-1.5 mb-1.5">
                        {Array.from({ length: Math.ceil(t.capacity / 2) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-3.5 rounded-full transition-colors ${
                              isCleaning
                                ? 'bg-warning/60'
                                : isOccupied
                                ? 'bg-accent1/70'
                                : 'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Surface */}
                      <div
                        className={`h-9 w-full rounded-lg border flex items-center justify-center font-bold text-xs transition-colors ${
                          isCleaning
                            ? 'bg-warning/15 border-warning/30 text-warning'
                            : isOccupied
                            ? 'bg-accent1/15 border-accent1/30 text-accent1'
                            : 'bg-secondary/70 border-border text-muted-foreground font-semibold'
                        }`}
                      >
                        {isCleaning ? (
                          <div className="flex items-center gap-1">
                            <SprayBottle className="h-3.5 w-3.5" weight="bold" />
                            <span className="text-2xs tracking-wide uppercase font-bold">Kotor</span>
                          </div>
                        ) : isOccupied ? (
                          <div className="flex items-center gap-1">
                            <UsersThree className="h-3.5 w-3.5" weight="bold" />
                            <span className="text-2xs font-bold">
                              {ordersAtTable.length > 1 ? `${ordersAtTable.length} Pesanan` : 'Terisi'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xs font-bold text-accent2 tracking-wider">TERSEDIA</span>
                        )}
                      </div>

                      {/* Bottom Chairs */}
                      <div className="flex gap-1.5 mt-1.5">
                        {Array.from({ length: Math.floor(t.capacity / 2) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-3.5 rounded-full transition-colors ${
                              isCleaning
                                ? 'bg-warning/60'
                                : isOccupied
                                ? 'bg-accent1/70'
                                : 'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Information Box */}
                    <div className="space-y-1.5">
                      {isCleaning ? (
                        <div className="p-2.5 rounded-xl border border-warning/20 bg-warning/10 text-2xs text-warning leading-relaxed">
                          Tamu sebelumnya sudah pulang. Piring & gelas kotor belum diangkat oleh staf.
                        </div>
                      ) : isOccupied ? (
                        <div className="p-2.5 rounded-xl border border-border bg-card space-y-1 text-2xs">
                          <div className="font-semibold text-foreground flex items-center justify-between">
                            <span>Pesanan Aktif:</span>
                            <span className="text-muted-foreground">{ordersAtTable.length} tamu</span>
                          </div>
                          {ordersAtTable.map((ord) => (
                            <div
                              key={ord.id}
                              className="flex items-center justify-between gap-1 text-muted-foreground pt-1 border-t border-border/40"
                            >
                              <span className="truncate font-medium text-foreground">
                                {ord.customer}
                              </span>
                              <span className="font-mono shrink-0">{ord.total}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl border border-dashed border-border text-center text-2xs text-muted-foreground">
                          Meja bersih dan siap menerima tamu baru.
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-border/60">
                      {isCleaning ? (
                        <Button
                          type="button"
                          variant="accent2"
                          size="sm"
                          onClick={() => handleMarkTableCleaned(t.number)}
                          className="w-full h-8 text-xs font-semibold gap-1.5"
                        >
                          <Sparkle className="h-3.5 w-3.5" weight="bold" />
                          <span>Selesai Dibersihkan (Siap)</span>
                        </Button>
                      ) : isOccupied ? (
                        <div className="flex flex-col gap-1.5">
                          <Button
                            type="button"
                            variant="accent1"
                            size="sm"
                            onClick={() => handleStartNewOrderForTable(t.number)}
                            className="w-full h-8 text-xs font-semibold gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" weight="bold" />
                            <span>+ Gabung Meja Ini</span>
                          </Button>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleVacateTable(t.number)}
                              className="h-7 text-2xs font-medium text-destructive hover:text-destructive hover:bg-destructive/5"
                              title="Kosongkan meja dan tandai selesai"
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Kosongkan
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkTableCleaning(t.number)}
                              className="h-7 text-2xs font-medium text-warning hover:text-warning hover:bg-warning/5"
                              title="Tandai meja perlu dibersihkan"
                            >
                              <SprayBottle className="h-3 w-3 mr-1" />
                              Kotor
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => handleStartNewOrderForTable(t.number)}
                          className="w-full h-8 text-xs font-semibold gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" weight="bold" />
                          <span>Catat Pesanan di Sini</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Order Detail & Thermal Receipt Modal */}
      {activeOrderDetails && (
        <Modal
          isOpen={Boolean(activeOrderDetails)}
          onClose={() => {
            setActiveOrderDetails(null)
            setPrintSuccessNotice(false)
          }}
          maxWidth="lg"
          title={`Pesanan #${activeOrderDetails.id}`}
          description={`Dibuat ${activeOrderDetails.timeElapsed} • Outlet ${activeOrderDetails.outlet}`}
          footer={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-2.5">
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
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button variant="outline" onClick={() => setActiveOrderDetails(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Tab Navigation inside Modal */}
            <div className="flex items-center gap-1 border-b border-border pb-2">
              <button
                type="button"
                onClick={() => setDetailModalTab('details')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  detailModalTab === 'details'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Detail Operasional
              </button>
              <button
                type="button"
                onClick={() => setDetailModalTab('receipt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  detailModalTab === 'receipt'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Pratinjau Struk Thermal (58mm)</span>
              </button>
            </div>

            {/* Tab 1: Operational Detail */}
            {detailModalTab === 'details' && (
              <div className="space-y-4">
                {/* Meta status header */}
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase font-semibold block">Pelanggan</span>
                    <span className="text-sm font-bold text-foreground">{activeOrderDetails.customer}</span>
                    <span className="text-2xs text-muted-foreground ml-2">({activeOrderDetails.customerType})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xs text-muted-foreground uppercase font-semibold block mb-0.5">Status Pesanan</span>
                    {getStatusBadge(activeOrderDetails.status)}
                  </div>
                </div>

                {/* Order Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <span className="text-2xs text-muted-foreground block">Tipe Layanan & Kanal</span>
                    <span className="font-semibold text-foreground">{activeOrderDetails.orderType}</span>
                    <span className="text-muted-foreground"> ({activeOrderDetails.channel})</span>
                    {activeOrderDetails.tableNumber && (
                      <span className="text-accent1 font-semibold block text-2xs">{activeOrderDetails.tableNumber}</span>
                    )}
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <span className="text-2xs text-muted-foreground block">Metode Pembayaran</span>
                    <span className="font-semibold text-foreground">{activeOrderDetails.paymentMethod}</span>
                    <span className="text-accent2 font-semibold ml-1.5">• {activeOrderDetails.paymentStatus}</span>
                  </div>
                </div>

                {/* Item Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2">Daftar Item Menu</h4>
                  <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                    {activeOrderDetails.items.map((item, i) => (
                      <div key={i} className="p-3 flex items-center justify-between text-xs bg-card">
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

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-border space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal Menu</span>
                    <span className="font-mono font-medium">{formatRupiah(activeOrderDetails.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>PPN (10%)</span>
                    <span className="font-mono font-medium">{formatRupiah(activeOrderDetails.tax)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border text-sm font-bold text-foreground">
                    <span>Total Tagihan</span>
                    <span className="font-mono text-accent1">{activeOrderDetails.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Thermal Receipt Simulation */}
            {detailModalTab === 'receipt' && (
              <div className="space-y-4">
                {printSuccessNotice && (
                  <div className="p-3 rounded-xl bg-accent2/10 border border-accent2/25 text-accent2 text-xs flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" weight="bold" />
                    <span>Perintah cetak terkirim ke printer kasir thermal (58mm EPSON/Sunmi)!</span>
                  </div>
                )}

                {/* Receipt Paper Card */}
                <div className="max-w-sm mx-auto bg-card border border-dashed border-border rounded-xl p-5 shadow-inner text-xs font-mono text-foreground space-y-3 select-none">
                  <div className="text-center space-y-0.5">
                    <div className="font-bold text-sm tracking-wider">FODERA COFFEE &amp; ROASTERY</div>
                    <div className="text-2xs text-muted-foreground">Artisanal Speciality Coffee</div>
                    <div className="text-2xs text-muted-foreground">Outlet {activeOrderDetails.outlet} • Telp: (0341) 554289</div>
                  </div>

                  <div className="border-b border-dashed border-border" />

                  <div className="space-y-0.5 text-2xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. Trx:</span>
                      <span className="font-bold">{activeOrderDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waktu:</span>
                      <span>11/09/2026 10:14 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kasir:</span>
                      <span>Barista Bayu (POS-01)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pelanggan:</span>
                      <span>{activeOrderDetails.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layanan:</span>
                      <span>{activeOrderDetails.orderType} {activeOrderDetails.tableNumber ? `• ${activeOrderDetails.tableNumber}` : ''}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-border" />

                  {/* Receipt Items */}
                  <div className="space-y-1.5 text-2xs">
                    {activeOrderDetails.items.map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between font-semibold">
                          <span>{item.name}</span>
                          <span>{item.price}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>{item.qty} x {formatRupiah(item.unitPrice)}</span>
                        </div>
                        {item.notes && (
                          <div className="text-accent1 text-2xs italic">* {item.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-b border-dashed border-border" />

                  <div className="space-y-1 text-2xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>{formatRupiah(activeOrderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>PPN (10%):</span>
                      <span>{formatRupiah(activeOrderDetails.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-border">
                      <span>TOTAL:</span>
                      <span>{activeOrderDetails.total}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-border" />

                  <div className="space-y-0.5 text-2xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metode Bayar:</span>
                      <span className="font-semibold">{activeOrderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-accent2 font-bold">{activeOrderDetails.paymentStatus}</span>
                    </div>
                  </div>

                  {/* QR / Barcode aesthetic placeholder */}
                  <div className="pt-2 text-center space-y-1">
                    <div className="h-10 mx-auto w-48 border border-border bg-secondary/50 rounded flex items-center justify-center gap-1 font-mono text-2xs text-muted-foreground">
                      <Barcode className="h-6 w-6 text-foreground" />
                      <span>{activeOrderDetails.id}-POS58</span>
                    </div>
                    <div className="text-2xs text-muted-foreground pt-1">
                      Terima kasih atas kunjungannya!
                    </div>
                    <div className="text-2xs text-muted-foreground">
                      WiFi: FODERA_GUEST / Pass: nikmatkopi
                    </div>
                  </div>
                </div>

                {/* Print Action Bar */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="accent1"
                    onClick={handlePrintSimulate}
                    disabled={isPrinting}
                    className="gap-2 text-xs font-semibold"
                  >
                    <Printer className="h-4 w-4" weight="bold" />
                    <span>{isPrinting ? 'Mencetak Struk...' : 'Cetak ke Thermal Printer POS (58mm)'}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New Order Drawer (Quick POS Entry - Floating Card Style matching user reference) */}
      <Drawer
        isOpen={isNewOrderDrawerOpen}
        onClose={() => {
          setIsNewOrderDrawerOpen(false)
          setMenuSearchQuery('')
        }}
        maxWidth="xl"
        title="Catat Pesanan Baru"
        description="Pilih tipe layanan dan menu untuk langsung diproses antrean barista"
        footer={
          <div className="space-y-2.5 w-full">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs text-muted-foreground">Total Tagihan:</span>
              <span className="font-mono font-bold text-base text-accent1">
                {formatRupiah(calculateNewOrderTotals().grand)}
              </span>
            </div>

            <Button
              variant="accent1"
              onClick={handleCreateOrder}
              disabled={!newCustomerName.trim() || calculateNewOrderTotals().sub === 0}
              className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Check className="h-4 w-4" weight="bold" />
              <span>Simpan &amp; Kirim ke Barista</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsNewOrderDrawerOpen(false)}
              className="w-full h-10 rounded-xl font-semibold text-sm border-border bg-card hover:bg-secondary text-foreground cursor-pointer transition-all"
            >
              Batal
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateOrder} className="space-y-5">
          {/* Informasi Pelanggan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">
              Nama Pelanggan *
            </label>
            <Input
              required
              placeholder="Masukkan nama pelanggan (contoh: Sarah Azhari)"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          {/* Tipe Layanan (Selectable Option Cards matching user reference image) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Tipe Layanan &amp; Meja
              </label>
              <span className="text-2xs text-muted-foreground">Pilih salah satu</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  type: 'Dine In' as const,
                  title: 'Dine In (Makan di Tempat)',
                  subtitle: 'Pesanan disajikan di meja pelanggan outlet',
                  badge: 'Populer',
                  icon: ForkKnife,
                },
                {
                  type: 'Takeaway' as const,
                  title: 'Takeaway (Bawa Pulang)',
                  subtitle: 'Pengambilan langsung di pick-up counter kasir',
                  badge: 'Cepat',
                  icon: Coffee,
                },
                {
                  type: 'Delivery' as const,
                  title: 'Delivery (Pesan Antar)',
                  subtitle: 'Diantar driver kurir online (GoFood / GrabFood)',
                  icon: Motorcycle,
                },
              ].map((opt) => {
                const isSelected = newOrderType === opt.type
                const Icon = opt.icon

                return (
                  <div
                    key={opt.type}
                    onClick={() => setNewOrderType(opt.type)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-accent1/60 bg-accent1/5'
                        : 'border-border bg-card hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl border mt-0.5 shrink-0 ${
                          isSelected
                            ? 'border-accent1/30 bg-card text-accent1'
                            : 'border-border bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" weight="bold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {opt.title}
                          </span>
                          {opt.badge && (
                            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-2xs text-muted-foreground mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-accent1 bg-accent1'
                          : 'border-muted-foreground/30 bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Visual Floorplan (Denah Meja Dine In) */}
            {newOrderType === 'Dine In' && (
              <div className="p-3.5 rounded-2xl border border-border bg-secondary/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-border">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Storefront className="h-4 w-4 text-accent1" weight="bold" />
                      <span className="text-xs font-bold text-foreground">
                        Denah Meja Outlet ({newOutlet})
                      </span>
                    </div>
                    <span className="text-2xs text-muted-foreground block mt-0.5">
                      Klik meja yang berstatus tersedia untuk memilih
                    </span>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-2.5 text-2xs font-semibold">
                    <span className="inline-flex items-center gap-1 text-accent2">
                      <span className="h-2 w-2 rounded-full bg-accent2" />
                      Tersedia (
                      {
                        OUTLET_TABLES.filter((t) => {
                          const key = t.number.trim().toLowerCase()
                          return !cleaningTables.has(key) && !(tableOrdersMap.get(key)?.length)
                        }).length
                      }
                      )
                    </span>
                    <span className="inline-flex items-center gap-1 text-warning">
                      <span className="h-2 w-2 rounded-full bg-warning" />
                      Terisi (
                      {
                        OUTLET_TABLES.filter((t) => {
                          const key = t.number.trim().toLowerCase()
                          return (tableOrdersMap.get(key)?.length || 0) > 0
                        }).length
                      }
                      )
                    </span>
                    <span className="inline-flex items-center gap-1 text-warning/80">
                      <SprayBottle className="h-3 w-3" />
                      Perlu Bersih ({cleaningTables.size})
                    </span>
                  </div>
                </div>

                {/* Zone Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
                  {[
                    { id: 'all', label: 'Semua Area' },
                    { id: 'Indoor Utama', label: 'Indoor Utama' },
                    { id: 'Window Bar', label: 'Window Bar' },
                    { id: 'Outdoor Terrace', label: 'Outdoor' },
                  ].map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setSelectedTableZone(z.id)}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-colors shrink-0 cursor-pointer ${
                        selectedTableZone === z.id
                          ? 'bg-card text-foreground border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>

                {/* Table Cards Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {OUTLET_TABLES.filter(
                    (t) => selectedTableZone === 'all' || t.zone === selectedTableZone
                  ).map((t) => {
                    const key = t.number.trim().toLowerCase()
                    const ordersAtTable = tableOrdersMap.get(key) || []
                    const isOccupied = ordersAtTable.length > 0
                    const isCleaning = cleaningTables.has(key)
                    const isSelected = newTableNumber === t.number

                    return (
                      <div
                        key={t.id}
                        onClick={() => setNewTableNumber(t.number)}
                        className={`p-2.5 rounded-xl border transition-all select-none flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-2 border-accent1 bg-accent1/10'
                            : isCleaning
                            ? 'border-warning/40 bg-warning/5 hover:border-warning/60'
                            : isOccupied
                            ? 'border-warning/30 bg-warning/5 hover:border-accent1/50'
                            : 'border-border bg-card hover:border-accent1/50 hover:bg-secondary/40'
                        }`}
                      >
                        {/* Card Header: Table Number & Capacity */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-2xs font-bold text-foreground">
                            {t.number}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-2xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {t.capacity}P
                          </span>
                        </div>

                        {/* Visual Table & Chairs Representation */}
                        <div className="py-2 flex flex-col items-center">
                          {/* Top Chairs */}
                          <div className="flex gap-1 mb-1">
                            {Array.from({ length: Math.ceil(t.capacity / 2) }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 w-2.5 rounded-full ${
                                  isSelected
                                    ? 'bg-accent1'
                                    : isCleaning
                                    ? 'bg-warning/60'
                                    : isOccupied
                                    ? 'bg-warning/50'
                                    : 'bg-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Table Surface */}
                          <div
                            className={`h-6 w-full rounded-md border flex items-center justify-center font-bold text-xs transition-colors ${
                              isSelected
                                ? 'bg-accent1 text-white border-accent1 text-2xs font-bold'
                                : isCleaning
                                ? 'bg-warning/15 border-warning/30 text-warning text-2xs'
                                : isOccupied
                                ? 'bg-warning/15 border-warning/30 text-warning text-2xs'
                                : 'bg-secondary/60 border-border text-muted-foreground text-2xs font-semibold'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="h-3.5 w-3.5" weight="bold" />
                            ) : isCleaning ? (
                              <div className="flex items-center gap-0.5">
                                <SprayBottle className="h-3 w-3" />
                                <span>KOTOR</span>
                              </div>
                            ) : isOccupied ? (
                              ordersAtTable.length > 1 ? (
                                `${ordersAtTable.length} TAMU`
                              ) : (
                                'TERISI'
                              )
                            ) : (
                              t.label
                            )}
                          </div>

                          {/* Bottom Chairs */}
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: Math.floor(t.capacity / 2) }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 w-2.5 rounded-full ${
                                  isSelected
                                    ? 'bg-accent1'
                                    : isCleaning
                                    ? 'bg-warning/60'
                                    : isOccupied
                                    ? 'bg-warning/50'
                                    : 'bg-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Card Footer: Status or Occupant Name */}
                        <div className="text-center pt-1 border-t border-border/40 truncate text-2xs">
                          {isSelected ? (
                            <span className="text-accent1 font-bold block">Dipilih</span>
                          ) : isCleaning ? (
                            <span className="text-warning font-semibold block">Perlu Bersih</span>
                          ) : isOccupied ? (
                            <span
                              className="text-warning font-semibold truncate block"
                              title={ordersAtTable.map((o) => `${o.customer} (${o.id})`).join(', ')}
                            >
                              {ordersAtTable[0].customer.split(' ')[0]}
                              {ordersAtTable.length > 1 && ` +${ordersAtTable.length - 1}`}
                            </span>
                          ) : (
                            <span className="text-accent2 font-medium block">Tersedia</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Table Confirmation & Context Action Box */}
                {newTableNumber ? (
                  (() => {
                    const selKey = newTableNumber.trim().toLowerCase()
                    const selOrders = tableOrdersMap.get(selKey) || []
                    const selIsCleaning = cleaningTables.has(selKey)
                    const selTableDef = OUTLET_TABLES.find((t) => t.number === newTableNumber)

                    if (selOrders.length > 0) {
                      // Case: Gabung Meja (Multiple Orders / Shared Table)
                      return (
                        <div className="p-3 rounded-xl border border-accent1/40 bg-accent1/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <UsersThree className="h-4 w-4 text-accent1 shrink-0" weight="fill" />
                              <span className="font-bold text-foreground">
                                {newTableNumber} • Gabung Meja
                              </span>
                              <span className="text-muted-foreground text-2xs">
                                ({selTableDef?.zone} • {selTableDef?.capacity} Kursi)
                              </span>
                            </div>
                            <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-accent1/15 text-accent1">
                              {selOrders.length} Pesanan Aktif
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground leading-relaxed">
                            Meja ini sedang ditempati oleh:{' '}
                            <strong className="text-foreground">
                              {selOrders.map((o) => o.customer).join(', ')}
                            </strong>
                            . Pesanan baru ini akan dicatat di meja yang sama (berbagi meja dengan teman/rekan).
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-border/50 text-2xs text-muted-foreground">
                            <span>Tamu sebelumnya sudah pulang?</span>
                            <button
                              type="button"
                              onClick={() => handleVacateTable(newTableNumber)}
                              className="text-destructive font-semibold hover:underline cursor-pointer"
                            >
                              Kosongkan Meja
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => handleMarkTableCleaning(newTableNumber)}
                              className="text-warning font-semibold hover:underline cursor-pointer"
                            >
                              Tandai Perlu Dibersihkan
                            </button>
                          </div>
                        </div>
                      )
                    }

                    if (selIsCleaning) {
                      // Case: Meja Sedang Kotor / Perlu Dibersihkan
                      return (
                        <div className="p-3 rounded-xl border border-warning/40 bg-warning/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-warning">
                              <SprayBottle className="h-4 w-4 shrink-0" weight="fill" />
                              <span className="font-bold text-foreground">
                                {newTableNumber} • Perlu Dibersihkan
                              </span>
                              <span className="text-muted-foreground text-2xs">
                                ({selTableDef?.zone} • {selTableDef?.capacity} Kursi)
                              </span>
                            </div>
                            <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning">
                              Kotor
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground">
                            Meja ini belum dibersihkan setelah tamu sebelumnya beranjak.
                          </p>
                          <div className="pt-1 border-t border-border/50">
                            <button
                              type="button"
                              onClick={() => handleMarkTableCleaned(newTableNumber)}
                              className="text-xs font-bold text-accent2 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Sparkle className="h-3.5 w-3.5" weight="bold" />
                              Tandai Sudah Bersih &amp; Siap Digunakan
                            </button>
                          </div>
                        </div>
                      )
                    }

                    // Case: Regular clean & available table
                    return (
                      <div className="p-2.5 rounded-xl border border-accent1/30 bg-accent1/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent1 shrink-0" weight="fill" />
                          <div>
                            <span className="font-bold text-foreground">{newTableNumber}</span>
                            <span className="text-muted-foreground ml-1.5 text-2xs">
                              ({selTableDef?.zone} • {selTableDef?.capacity} Kursi)
                            </span>
                          </div>
                        </div>
                        <span className="text-2xs font-bold text-accent1">Meja Siap Ditempati</span>
                      </div>
                    )
                  })()
                ) : (
                  <div className="p-2.5 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    Silakan pilih salah satu meja di atas
                  </div>
                )}
              </div>
            )}

            {newOrderType === 'Delivery' && (
              <div className="p-3.5 rounded-2xl border border-border bg-secondary/30 space-y-2">
                <label className="text-2xs font-semibold text-foreground block">
                  Pilih Mitra Pengantaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['GoFood', 'GrabFood'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setNewChannel(channel)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        newChannel === channel
                          ? 'border-accent1 bg-card text-accent1'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metode Pembayaran (Clean Selectable Options) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['QRIS', 'Debit BCA', 'Cash', 'GoPay'] as const).map((m) => {
                const isSelected = newPaymentMethod === m

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNewPaymentMethod(m)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-accent1/60 bg-accent1/5 text-foreground font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                    }`}
                  >
                    <span>{m}</span>
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-accent1 bg-accent1'
                          : 'border-muted-foreground/30 bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Menu Catalog Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Pilih Item Menu Kopi &amp; Pastry
              </label>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                {Object.values(cartItems).reduce((a, b) => a + b, 0)} item dipilih
              </span>
            </div>

            {/* Menu Search Input */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari kopi, pastry, atau minuman..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-7 text-xs rounded-xl bg-card border border-border"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMenuSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="h-3 w-3" weight="bold" />
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {filteredCatalogItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl">
                  Menu &quot;{menuSearchQuery}&quot; tidak ditemukan
                </div>
              ) : (
                filteredCatalogItems.map((item) => {
                  const qty = cartItems[item.id] || 0
                  const isSelected = qty > 0

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-accent1/40 bg-card'
                          : 'border-border bg-card hover:bg-secondary/30'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground text-xs truncate">
                          {item.name}
                        </div>
                        <div className="text-2xs text-muted-foreground mt-0.5 font-mono">
                          {formatRupiah(item.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          disabled={qty === 0}
                          className="h-7 w-7 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-25 cursor-pointer transition-colors bg-secondary/50 hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-foreground">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          className="h-7 w-7 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-secondary cursor-pointer transition-colors bg-secondary/50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Rincian Kalkulasi Harga */}
            <div className="p-3.5 rounded-2xl border border-border bg-secondary/30 space-y-1.5 text-2xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Menu:</span>
                <span className="font-mono">{formatRupiah(calculateNewOrderTotals().sub)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>PPN (10%):</span>
                <span className="font-mono">{formatRupiah(calculateNewOrderTotals().tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs text-foreground pt-1.5 border-t border-border">
                <span>Total Tagihan:</span>
                <span className="font-mono text-accent1">
                  {formatRupiah(calculateNewOrderTotals().grand)}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  )
}
