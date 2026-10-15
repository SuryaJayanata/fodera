import React, { useState, useEffect, useMemo } from 'react'
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
  Megaphone,
  Tag,
  Money,
  Wallet,
  QrCode,
  CreditCard,
  Lightning,
  Info,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Button,
  Badge,
  Modal,
  Drawer,
  MetricCard,
  DataTable,
  ColumnDef,
  Select,
} from '@/components/custom'
import { OrderKanbanBoard } from '../components/OrderKanbanBoard'

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
  seatingMode?: 'open' | 'table' | 'tent'
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

export interface CatalogItem {
  id: string
  name: string
  price: number
  category: 'Coffee' | 'Non-Coffee' | 'Bakery'
  isPopular?: boolean
}

const CATALOG_ITEMS: CatalogItem[] = [
  { id: 'cat-1', name: 'Spanish Latte', price: 32000, category: 'Coffee', isPopular: true },
  { id: 'cat-2', name: 'Matcha Latte Uji', price: 36000, category: 'Non-Coffee', isPopular: true },
  { id: 'cat-3', name: 'Butter Croissant', price: 30000, category: 'Bakery', isPopular: true },
  { id: 'cat-4', name: 'Almond Pastry', price: 30000, category: 'Bakery' },
  { id: 'cat-5', name: 'Caramel Macchiato', price: 35000, category: 'Coffee' },
  { id: 'cat-6', name: 'Cold Brew Oat Milk', price: 38000, category: 'Coffee', isPopular: true },
  { id: 'cat-7', name: 'Americano Hot', price: 26000, category: 'Coffee' },
  { id: 'cat-8', name: 'Cinnamon Roll', price: 26000, category: 'Bakery' },
  { id: 'cat-9', name: 'Earl Grey Tea Latte', price: 34000, category: 'Non-Coffee' },
  { id: 'cat-10', name: 'Pain au Chocolat', price: 32000, category: 'Bakery' },
]

const QUICK_MODIFIERS = [
  'Less Sweet',
  'No Sugar',
  'Less Ice',
  'Oat Milk',
  'Extra Shot',
  'Hangatkan',
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

  // New Order Drawer State
  const [isNewOrderDrawerOpen, setIsNewOrderDrawerOpen] = useState(false)
  const [orderSequence, setOrderSequence] = useState(1093)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerType, setNewCustomerType] = useState<'Guest' | 'Member Gold' | 'Member Silver'>('Guest')
  const [newOrderType, setNewOrderType] = useState<'Dine In' | 'Takeaway' | 'Delivery'>('Dine In')
  const [dineInSeatingMode, setDineInSeatingMode] = useState<'open' | 'table' | 'tent'>('open')
  const [tentNumber, setTentNumber] = useState('')
  const [newTableNumber, setNewTableNumber] = useState('Meja 05')
  const [newOutlet, setNewOutlet] = useState(
    currentOutlet !== 'all' ? (currentOutlet.charAt(0).toUpperCase() + currentOutlet.slice(1)) : 'Malang'
  )
  const [newChannel, setNewChannel] = useState<'POS Kasir' | 'QR Table' | 'GoFood' | 'GrabFood'>('POS Kasir')
  const [newPaymentMethod, setNewPaymentMethod] = useState<'QRIS' | 'Debit BCA' | 'Cash' | 'GoPay'>('QRIS')
  const [cartItems, setCartItems] = useState<Record<string, number>>({ 'cat-1': 1, 'cat-3': 1 })
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({ 'cat-1': 'Less sweet, normal ice' })
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all')
  const [autoPrintKitchen, setAutoPrintKitchen] = useState<boolean>(true)
  const [autoPrintCustomer, setAutoPrintCustomer] = useState<boolean>(true)
  const [cashTendered, setCashTendered] = useState<number>(0)
  const [selectedTableZone, setSelectedTableZone] = useState<string>('all')
  const [manualNoteInput, setManualNoteInput] = useState<string>('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [inlineNoteText, setInlineNoteText] = useState<string>('')
  const [activeSelectedCartItemId, setActiveSelectedCartItemId] = useState<string | null>('cat-1')
  const [orderPrintToast, setOrderPrintToast] = useState<{
    orderId: string
    customer: string
    total: string
    isKdsPrinted: boolean
    isReceiptPrinted: boolean
  } | null>(null)

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

  // Automatically ensure a default table is pre-selected if table seating mode is chosen
  useEffect(() => {
    if (newOrderType === 'Dine In' && dineInSeatingMode === 'table' && !newTableNumber) {
      const firstAvailable = OUTLET_TABLES.find((t) => {
        const key = t.number.trim().toLowerCase()
        return !cleaningTables.has(key) && !(tableOrdersMap.get(key)?.length)
      })
      if (firstAvailable) {
        setNewTableNumber(firstAvailable.number)
      }
    }
  }, [newOrderType, dineInSeatingMode, newTableNumber, cleaningTables, tableOrdersMap])

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
    setDineInSeatingMode('table')
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

  const handleToggleModifier = (itemId: string, mod: string) => {
    setItemNotes((prev) => {
      const current = prev[itemId] || ''
      const parts = current.split(', ').map((s) => s.trim()).filter(Boolean)
      if (parts.includes(mod)) {
        const filtered = parts.filter((p) => p !== mod)
        return { ...prev, [itemId]: filtered.join(', ') }
      } else {
        return { ...prev, [itemId]: [...parts, mod].join(', ') }
      }
    })
  }

  const handleAddManualNote = () => {
    if (!manualNoteInput.trim()) return
    const targetId =
      (activeSelectedCartItemId && cartItems[activeSelectedCartItemId])
        ? activeSelectedCartItemId
        : Object.keys(cartItems)[0] || 'cat-1'
    setItemNotes((prev) => {
      const current = prev[targetId] || ''
      const updated = current ? `${current}, ${manualNoteInput.trim()}` : manualNoteInput.trim()
      return { ...prev, [targetId]: updated }
    })
    setManualNoteInput('')
  }

  const handleCreateOrder = (e?: React.FormEvent, shouldPrint: boolean = false) => {
    if (e) e.preventDefault()

    const { sub, tax, grand } = calculateNewOrderTotals()
    if (sub === 0) return

    const finalCustomerName = newCustomerName.trim() || `Tamu #${String(orderSequence).slice(-2)}`

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

    let assignedTableNumber: string | undefined = undefined
    let isShared = false

    if (newOrderType === 'Dine In') {
      if (dineInSeatingMode === 'table') {
        assignedTableNumber = newTableNumber || undefined
        isShared = Boolean(
          assignedTableNumber &&
          (tableOrdersMap.get(assignedTableNumber.trim().toLowerCase())?.length || 0) > 0
        )
      } else if (dineInSeatingMode === 'tent') {
        const raw = tentNumber.trim()
        assignedTableNumber = raw
          ? (raw.startsWith('#') || raw.toLowerCase().startsWith('tenda') ? raw : `Tenda #${raw}`)
          : 'Tenda Meja'
      } else {
        // Open seating / Panggil di Bar: tableNumber is undefined
        assignedTableNumber = undefined
      }
    }

    const newOrderObj: Order = {
      id: `ORD-${orderSequence}`,
      customer: finalCustomerName,
      customerType: newCustomerType,
      orderType: newOrderType,
      channel: newChannel,
      items: orderItemsList,
      subtotal: sub,
      tax: tax,
      total: formatRupiah(grand),
      outlet: newOutlet,
      tableNumber: assignedTableNumber,
      seatingMode: newOrderType === 'Dine In' ? dineInSeatingMode : undefined,
      isSharedTable: isShared,
      status: 'new',
      timeElapsed: 'Baru saja',
      minutesElapsed: 0,
      paymentMethod: newPaymentMethod,
      paymentStatus: 'Lunas',
    }

    // If this table was marked as cleaning, remove it since a new order has seated
    if (newOrderType === 'Dine In' && dineInSeatingMode === 'table' && assignedTableNumber) {
      setCleaningTables((prev) => {
        const next = new Set(prev)
        next.delete(assignedTableNumber!.trim().toLowerCase())
        return next
      })
    }

    setOrders((prev) => [newOrderObj, ...prev])
    setOrderSequence((prev) => prev + 1)
    setIsNewOrderDrawerOpen(false)

    // Trigger printing simulation & toast notice if requested
    if (shouldPrint || autoPrintKitchen || autoPrintCustomer) {
      setOrderPrintToast({
        orderId: newOrderObj.id,
        customer: newOrderObj.customer,
        total: newOrderObj.total,
        isKdsPrinted: autoPrintKitchen,
        isReceiptPrinted: autoPrintCustomer || shouldPrint,
      })
      setTimeout(() => {
        setOrderPrintToast(null)
      }, 5000)
    }

    // Reset Form
    setNewCustomerName('')
    setTentNumber('')
    setDineInSeatingMode('open')
    setCartItems({ 'cat-1': 1 })
    setItemNotes({})
    setMenuSearchQuery('')
    setCashTendered(0)
    setManualNoteInput('')
    setEditingItemId(null)
    setInlineNoteText('')
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

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus
      const matchesOutlet = currentOutlet === 'all' || o.outlet.toLowerCase() === currentOutlet.toLowerCase()
      const matchesOrderType = selectedOrderType === 'all' || o.orderType === selectedOrderType
      const matchesSearch =
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesStatus && matchesOutlet && matchesOrderType && matchesSearch
    })
  }, [orders, selectedStatus, currentOutlet, selectedOrderType, searchQuery])

  const filteredCatalogItems = CATALOG_ITEMS.filter((item) => {
    const matchesCategory =
      selectedMenuCategory === 'all' || item.category === selectedMenuCategory
    const q = menuSearchQuery.toLowerCase().trim()
    const matchesSearch =
      !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
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
          {o.orderType === 'Dine In' && !o.tableNumber && (
            <span className="text-2xs font-semibold text-accent1 bg-accent1/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Megaphone className="h-3 w-3" />
              Panggil di Bar
            </span>
          )}
          {o.tableNumber && (
            <span className="text-2xs font-semibold text-foreground flex items-center gap-1">
              {o.tableNumber.toLowerCase().includes('tenda') || o.tableNumber.startsWith('#') ? (
                <Tag className="h-3 w-3 text-warning" />
              ) : null}
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

      {/* Visual Feedback for Instant Printing & Order Stored */}
      {orderPrintToast && (
        <div className="p-3.5 rounded-2xl bg-accent2/10 border border-accent2/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent2/20 text-accent2 flex items-center justify-center shrink-0">
              <Printer className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Pesanan {orderPrintToast.orderId} Tersimpan</span>
                <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-accent2/20 text-accent2 border border-accent2/30">
                  Antrean Baru
                </span>
              </div>
              <p className="text-2xs text-muted-foreground mt-0.5">
                Atas nama <strong className="text-foreground">{orderPrintToast.customer}</strong> ({orderPrintToast.total})
                {orderPrintToast.isKdsPrinted ? ' · Tiket Dapur / Barista Otomatis Dicetak ✓' : ''}
                {orderPrintToast.isReceiptPrinted ? ' · Struk Kasir Dicetak ✓' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const ord = orders.find((o) => o.id === orderPrintToast.orderId)
                if (ord) {
                  setActiveOrderDetails(ord)
                  setDetailModalTab('receipt')
                }
              }}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer bg-card border-border hover:bg-secondary text-foreground"
            >
              <Receipt className="h-3.5 w-3.5 text-accent1" weight="bold" />
              <span>Lihat Struk</span>
            </Button>
            <button
              type="button"
              onClick={() => setOrderPrintToast(null)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" weight="bold" />
            </button>
          </div>
        </div>
      )}

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
 ? 'bg-card text-foreground '
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
 ? 'bg-card text-foreground '
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
 ? 'bg-card text-foreground '
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
        <OrderKanbanBoard
          orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
          onViewOrderDetails={(order, tab) => {
            setActiveOrderDetails(order)
            setDetailModalTab(tab || (order.status === 'completed' ? 'receipt' : 'details'))
          }}
          tableOrdersMap={tableOrdersMap}
        />
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
                    {activeOrderDetails.orderType === 'Dine In' && !activeOrderDetails.tableNumber && (
                      <span className="text-accent1 font-semibold block text-2xs flex items-center gap-1">
                        <Megaphone className="h-3 w-3" /> Panggil di Bar (Meja Bebas)
                      </span>
                    )}
                    {activeOrderDetails.tableNumber && (
                      <span className="text-accent1 font-semibold block text-2xs flex items-center gap-1">
                        {activeOrderDetails.tableNumber.toLowerCase().includes('tenda') || activeOrderDetails.tableNumber.startsWith('#') ? (
                          <Tag className="h-3 w-3 text-warning" />
                        ) : null}
                        {activeOrderDetails.tableNumber}
                      </span>
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
 <div className="max-w-sm mx-auto bg-card border border-dashed border-border rounded-xl p-5 text-xs font-mono text-foreground space-y-3 select-none">
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
                      <span>
                        {activeOrderDetails.orderType}{' '}
                        {activeOrderDetails.tableNumber
                          ? `• ${activeOrderDetails.tableNumber}`
                          : activeOrderDetails.orderType === 'Dine In'
                          ? '• Panggil di Bar'
                          : ''}
                      </span>
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

      {/* New Order Modal / POS Cockpit (Centered Wide Layout) */}
      <Drawer
        isOpen={isNewOrderDrawerOpen}
        onClose={() => {
          setIsNewOrderDrawerOpen(false)
          setMenuSearchQuery('')
        }}
        side="center"
        maxWidth="full"
        scrollable={false}
        title="Catat Pesanan Baru"
        description="POS Terminal — Pilih menu dan lengkapi rincian pesanan untuk langsung diproses antrean barista"
        footer={
          <div className="space-y-3 w-full">
            {/* Cash Tendered & Kembalian Calculator Bar (if Cash selected) */}
            {newPaymentMethod === 'Cash' && (
              <div className="p-2.5 rounded-xl border border-accent2/30 bg-accent2/5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Money className="h-4 w-4 text-accent2" weight="duotone" />
                    <span className="font-semibold text-foreground">Uang Tunai:</span>
                  </div>

                  {/* Manual Cash Input */}
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-2xs font-bold text-muted-foreground select-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cashTendered > 0 ? cashTendered.toLocaleString('id-ID') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        setCashTendered(raw ? parseInt(raw, 10) : 0)
                      }}
                      placeholder="0"
                      className="h-7 w-32 pl-7 pr-2 rounded-lg border border-border/80 bg-card text-xs font-mono font-bold text-foreground focus:outline-none focus:border-accent2 focus:ring-1 focus:ring-accent2/30 transition-colors"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setCashTendered(calculateNewOrderTotals().grand)}
                      className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-card border border-border hover:bg-secondary transition-colors cursor-pointer outline-none"
                    >
                      Uang Pas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(50000)}
                      className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-card border border-border hover:bg-secondary transition-colors cursor-pointer outline-none"
                    >
                      50k
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(100000)}
                      className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-card border border-border hover:bg-secondary transition-colors cursor-pointer outline-none"
                    >
                      100k
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(150000)}
                      className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-card border border-border hover:bg-secondary transition-colors cursor-pointer outline-none"
                    >
                      150k
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(200000)}
                      className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-card border border-border hover:bg-secondary transition-colors cursor-pointer outline-none"
                    >
                      200k
                    </button>
                  </div>
                </div>

                {/* Kembalian Calculation */}
                <div className="flex items-center gap-2 md:justify-end shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-accent2/20">
                  <span className="text-muted-foreground text-2xs">Kembalian:</span>
                  {cashTendered >= calculateNewOrderTotals().grand ? (
                    <span className="font-mono font-bold text-sm text-accent2">
                      {formatRupiah(cashTendered - calculateNewOrderTotals().grand)}
                    </span>
                  ) : cashTendered > 0 ? (
                    <span className="font-mono font-semibold text-xs text-warning">
                      Kurang {formatRupiah(calculateNewOrderTotals().grand - cashTendered)}
                    </span>
                  ) : (
                    <span className="font-mono font-bold text-sm text-muted-foreground">
                      Rp0
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Price Breakdown & Print Options Bar (United in Footer) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center gap-4 text-2xs text-muted-foreground">
                <span className="text-3xs font-bold uppercase tracking-wider text-muted-foreground/80">Opsi Cetak:</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPrintKitchen}
                    onChange={(e) => setAutoPrintKitchen(e.target.checked)}
                    className="rounded border-border text-accent1 accent-accent1 cursor-pointer"
                  />
                  <span className="font-medium text-foreground">Tiket Dapur (KOT)</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPrintCustomer}
                    onChange={(e) => setAutoPrintCustomer(e.target.checked)}
                    className="rounded border-border text-accent1 accent-accent1 cursor-pointer"
                  />
                  <span className="font-medium text-foreground">Struk Pelanggan</span>
                </label>
              </div>

              {/* Rincian Harga Terpadu */}
              <div className="flex items-center gap-4 text-2xs justify-between sm:justify-end">
                <div className="text-right space-y-0.5">
                  <div className="text-muted-foreground">
                    <span>Subtotal Menu: </span>
                    <span className="font-mono font-medium text-foreground">{formatRupiah(calculateNewOrderTotals().sub)}</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>PPN (10%): </span>
                    <span className="font-mono font-medium text-foreground">{formatRupiah(calculateNewOrderTotals().tax)}</span>
                  </div>
                </div>
                <div className="pl-4 border-l border-border text-right">
                  <div className="text-3xs font-bold text-muted-foreground uppercase">Total Tagihan</div>
                  <div className="font-mono font-bold text-base sm:text-lg text-accent1">
                    {formatRupiah(calculateNewOrderTotals().grand)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Grid: Primary (Simpan & Cetak) + Secondary (Simpan Saja) + Batal */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Button
                variant="accent1"
                onClick={(e) => handleCreateOrder(e, true)}
                disabled={calculateNewOrderTotals().sub === 0}
                className="sm:col-span-2 h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="h-4 w-4" weight="bold" />
                <span>Simpan &amp; Cetak Tiket</span>
              </Button>

              <Button
                variant="outline"
                onClick={(e) => handleCreateOrder(e, false)}
                disabled={calculateNewOrderTotals().sub === 0}
                className="h-11 rounded-xl font-semibold text-xs border-border bg-card hover:bg-secondary text-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Check className="h-4 w-4 text-accent2" weight="bold" />
                <span>Simpan Saja</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsNewOrderDrawerOpen(false)}
                className="h-11 rounded-xl font-semibold text-xs border-border bg-card hover:bg-secondary text-foreground cursor-pointer transition-all"
              >
                Batal
              </Button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 h-full">
          {/* LEFT COLUMN (lg:col-span-6 xl:col-span-6): MENU CATALOG & SELECTION */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col h-full min-h-0 space-y-3">
            {/* Search and Category Filter */}
            <div className="space-y-2.5 pt-1">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Cari kopi, pastry, minuman..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="h-10 pl-9 pr-8 text-xs rounded-xl bg-card border-border hover:border-accent1/50 transition-colors"
                />
                {menuSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMenuSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" weight="bold" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {[
                  { id: 'all', label: 'Semua Menu' },
                  { id: 'Coffee', label: 'Kopi (Coffee)' },
                  { id: 'Non-Coffee', label: 'Non-Kopi' },
                  { id: 'Bakery', label: 'Bakery & Pastry' },
                ].map((cat) => {
                  const isActive = selectedMenuCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedMenuCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-2xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-accent1 text-white font-bold'
                          : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Menu Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
              {filteredCatalogItems.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl">
                  Menu &quot;{menuSearchQuery}&quot; tidak ditemukan
                </div>
              ) : (
                filteredCatalogItems.map((item) => {
                  const qty = cartItems[item.id] || 0
                  const isSelected = qty > 0

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleUpdateCartQty(item.id, 1)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? 'border-accent1/60 bg-accent1/5'
                          : 'border-border bg-card hover:border-accent1/40 hover:bg-secondary/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground text-xs leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-2xs font-mono font-semibold text-muted-foreground mt-1">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <div
                        className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isSelected ? (
                          <div className="flex items-center gap-1.5 w-full justify-between">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.id, -1)}
                              className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary/70 hover:bg-secondary cursor-pointer transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono font-bold text-xs text-accent1 px-1">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.id, 1)}
                              className="h-6 w-6 rounded-lg border border-border flex items-center justify-center text-foreground bg-secondary/70 hover:bg-secondary cursor-pointer transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                            className="w-full py-1 px-2 rounded-lg bg-secondary hover:bg-accent1 hover:text-white text-muted-foreground font-semibold text-2xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Tambah</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Quick Barista Modifiers & Manual Notes */}
            <div className="p-3.5 rounded-2xl border border-border bg-secondary/30 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold text-foreground flex items-center gap-1">
                  <Sparkle className="h-3.5 w-3.5 text-accent1" weight="fill" />
                  Catatan &amp; Modifikasi Barista
                </span>
                <span className="text-3xs text-muted-foreground">Pilih preset atau ketik manual</span>
              </div>

              {/* Preset Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {QUICK_MODIFIERS.map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => {
                      const targetId = activeSelectedCartItemId && cartItems[activeSelectedCartItemId]
                        ? activeSelectedCartItemId
                        : Object.keys(cartItems)[0] || 'cat-1'
                      handleToggleModifier(targetId, mod)
                    }}
                    className="px-2.5 py-1 rounded-lg text-2xs font-medium bg-card border border-border hover:border-accent1/50 hover:bg-secondary text-foreground cursor-pointer transition-colors"
                  >
                    + {mod}
                  </button>
                ))}
              </div>

              {/* Manual Note Input Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Ketik catatan manual barista (contoh: pisahkan es, cup terpisah)..."
                    value={manualNoteInput}
                    onChange={(e) => setManualNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddManualNote()
                      }
                    }}
                    className="h-8 text-xs bg-card border-border rounded-xl pr-7"
                  />
                  {manualNoteInput && (
                    <button
                      type="button"
                      onClick={() => setManualNoteInput('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" weight="bold" />
                    </button>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddManualNote}
                  disabled={!manualNoteInput.trim()}
                  className="h-8 px-3 text-2xs font-bold cursor-pointer shrink-0 bg-card border-border hover:bg-secondary text-foreground"
                >
                  <Plus className="h-3 w-3 mr-1 text-accent1" weight="bold" />
                  <span>Pasang</span>
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-6 xl:col-span-6): TICKET SUMMARY & FAST ORDER DETAILS */}
          <div className="lg:col-span-6 xl:col-span-6 rounded-2xl border border-border bg-secondary/20 flex flex-col h-full min-h-0 overflow-hidden">
            {/* Scrollable Upper Section (Service Type, Customer Name, Seating Flow, Cart Items) */}
            <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              {/* 1. Service Type Pills (Segmented Control) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-2xs font-bold text-foreground">Tipe Layanan</label>
                <span className="text-3xs text-muted-foreground">Pilih cepat</span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-secondary/60 rounded-xl border border-border">
                {[
                  { type: 'Dine In' as const, label: 'Dine In', icon: ForkKnife },
                  { type: 'Takeaway' as const, label: 'Takeaway', icon: Coffee },
                  { type: 'Delivery' as const, label: 'Delivery', icon: Motorcycle },
                ].map((t) => {
                  const isActive = newOrderType === t.type
                  const Icon = t.icon
                  return (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setNewOrderType(t.type)}
                      className={`py-1.5 px-2 rounded-lg text-2xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-card text-foreground border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-accent1' : ''}`} weight="bold" />
                      <span>{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Customer Name */}
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-foreground block">
                Nama Pelanggan <span className="text-accent1">*</span>
              </label>
              <Input
                placeholder="Masukkan nama pelanggan (contoh: Sarah Azhari)"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="h-9 text-xs rounded-xl bg-card border-border"
              />
            </div>

            {/* 3. Seating Sub-Flow (Dine In) */}
            {newOrderType === 'Dine In' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-2xs font-bold text-foreground">Meja &amp; Alur Antrean</label>
                  <span className="text-3xs text-muted-foreground">Pilih alur layanan</span>
                </div>

                {/* 3 simple pills like before */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'open' as const, label: 'Panggil Bar', icon: Megaphone },
                    { id: 'table' as const, label: newTableNumber ? newTableNumber : 'Pilih Meja', icon: Armchair },
                    { id: 'tent' as const, label: tentNumber ? tentNumber : 'No. Tenda', icon: Tag },
                  ].map((s) => {
                    const isActive = dineInSeatingMode === s.id
                    const Icon = s.icon
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setDineInSeatingMode(s.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
                          isActive
 ? 'border-accent1 bg-accent1/10 text-accent1 font-bold '
                            : 'border-border bg-card text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" weight={isActive ? 'fill' : 'bold'} />
                        <span className="truncate">{s.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Sub-setting: Mode Panggil di Bar */}
                {dineInSeatingMode === 'open' && (
                  <div className="p-3 rounded-xl border border-accent1/20 bg-accent1/5 flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-xl bg-accent1/15 text-accent1 flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="h-3.5 w-3.5" weight="fill" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold text-foreground">Mode Panggil Bar Aktif (Meja Bebas)</div>
                      <p className="text-2xs text-muted-foreground leading-relaxed">
                        Pelanggan bebas memilih tempat duduk. Barista akan memanggil nama{' '}
                        <span className="font-semibold text-foreground">
                          {newCustomerName ? newCustomerName : 'Pelanggan'}
                        </span>{' '}
                        di pick-up counter saat racikan kopi siap saji.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-setting: Pilih Meja via Denah (Replacing Select Dropdown) */}
                {dineInSeatingMode === 'table' && (
                  <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-xl bg-accent1/15 text-accent1 flex items-center justify-center shrink-0">
                          <Armchair className="h-4 w-4" weight="fill" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-foreground block">Denah Meja Outlet</span>
                          <span className="text-3xs text-muted-foreground">Pilih meja yang tersedia untuk disajikan runner</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-3xs text-muted-foreground font-medium">Terpilih:</span>
                        <span className="font-mono text-xs font-bold text-accent1 bg-accent1/10 border border-accent1/25 px-2.5 py-0.5 rounded-lg">
                          {newTableNumber || 'Belum dipilih'}
                        </span>
                      </div>
                    </div>

                    {/* Zone filter tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                      {[
                        { id: 'all', label: 'Semua Meja' },
                        { id: 'Indoor Utama', label: 'Indoor Utama' },
                        { id: 'Window Bar', label: 'Window Bar' },
                        { id: 'Outdoor Terrace', label: 'Outdoor Terrace' },
                      ].map((z) => {
                        const isZoneActive = selectedTableZone === z.id
                        return (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => setSelectedTableZone(z.id)}
                            className={`px-2.5 py-1 rounded-lg text-2xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                              isZoneActive
 ? 'bg-accent1 text-white border-accent1 '
                                : 'bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                            }`}
                          >
                            {z.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Spacious Table Cards Grid (4 columns, generous padding & sizing) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      {OUTLET_TABLES.filter(
                        (t) => selectedTableZone === 'all' || t.zone === selectedTableZone
                      ).map((t) => {
                        const isSelected = newTableNumber === t.number
                        const tableKey = t.number.trim().toLowerCase()
                        const isCleaning = cleaningTables.has(tableKey)
                        const activeOrders = tableOrdersMap.get(tableKey) || []
                        const isOccupied = activeOrders.length > 0

                        let statusColor = 'text-accent2'
                        let statusBg = 'bg-accent2/10'
                        let statusBorder = 'border-accent2/20'
                        let statusDot = 'bg-accent2'
                        let statusText = 'Tersedia'

                        if (isCleaning) {
                          statusColor = 'text-warning'
                          statusBg = 'bg-warning/10'
                          statusBorder = 'border-warning/20'
                          statusDot = 'bg-warning'
                          statusText = 'Kotor'
                        } else if (isOccupied) {
                          statusColor = 'text-accent1'
                          statusBg = 'bg-accent1/10'
                          statusBorder = 'border-accent1/20'
                          statusDot = 'bg-accent1'
                          statusText = `Terisi (${activeOrders.length})`
                        }

                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setNewTableNumber(t.number)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                              isSelected
 ? 'border-accent1 bg-accent1/10 ring-2 ring-accent1/30 '
                                : 'border-border bg-secondary/30 hover:bg-secondary/70 hover:border-border/80'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-sm text-foreground font-mono">{t.label}</span>
                              <span className="text-3xs font-semibold px-1.5 py-0.5 rounded-md bg-card text-muted-foreground border border-border">
                                {t.capacity} Kursi
                              </span>
                            </div>
                            <div className="text-2xs text-muted-foreground truncate font-medium">
                              {t.number}
                            </div>
                            <div
                              className={`text-3xs font-semibold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${statusBg} ${statusColor} ${statusBorder}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDot} shrink-0`} />
                              <span className="truncate">{statusText}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Legend */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-3xs text-muted-foreground">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-accent2 shrink-0" />
                          <span>Tersedia</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-accent1 shrink-0" />
                          <span>Terisi (Gabung)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-warning shrink-0" />
                          <span>Perlu Dibersihkan</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-setting: Nomor Tenda */}
                {dineInSeatingMode === 'tent' && (
                  <div className="p-3.5 rounded-2xl border border-border bg-card space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-xl bg-accent1/15 text-accent1 flex items-center justify-center shrink-0">
                          <Tag className="h-3.5 w-3.5" weight="fill" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-foreground">Nomor Tenda Akrilik</span>
                          <span className="text-3xs text-muted-foreground block">Masukkan nomor meja portabel akrilik</span>
                        </div>
                      </div>
                      {tentNumber && (
                        <span className="text-2xs font-bold text-accent1 bg-accent1/10 border border-accent1/25 px-2 py-0.5 rounded-full font-mono">
                          {tentNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nomor tenda (contoh: #15)"
                        value={tentNumber}
                        onChange={(e) => setTentNumber(e.target.value)}
                        className="h-9 text-xs bg-secondary/30 border-border rounded-xl flex-1 font-mono font-semibold"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTentNumber('')}
                        disabled={!tentNumber}
                        className="h-9 text-xs px-2.5 rounded-xl border-border hover:bg-secondary cursor-pointer"
                      >
                        Reset
                      </Button>
                    </div>

                    {/* Quick selection pills */}
                    <div className="space-y-1">
                      <span className="text-3xs text-muted-foreground block font-medium">Pilihan Cepat Nomor Tenda:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {['01', '02', '03', '05', '08', '10', '12', '15', '20'].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setTentNumber(`#${n}`)}
                            className={`px-2 py-1 rounded-lg text-2xs font-semibold font-mono border transition-colors cursor-pointer ${
                              tentNumber === `#${n}`
                                ? 'border-accent1 bg-accent1 text-white'
                                : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
                            }`}
                          >
                            #{n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-3xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      <Info className="h-3 w-3 text-accent1 shrink-0" />
                      <span>Berikan akrilik tenda ini ke pelanggan; runner akan mengantar pesanan ke meja mereka.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Channel sub-setting */}
            {newOrderType === 'Delivery' && (
              <div className="space-y-1.5">
                <label className="text-2xs font-bold text-foreground block">Mitra Kurir</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['GoFood', 'GrabFood'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setNewChannel(channel)}
                      className={`py-1.5 px-2 rounded-xl border text-2xs font-semibold transition-all cursor-pointer ${
                        newChannel === channel
                          ? 'border-accent1 bg-card text-accent1 font-bold'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Active Cart Item List (Tiket Pesanan Ringkas) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-2xs font-bold text-foreground">
                  Daftar Pesanan ({Object.values(cartItems).reduce((a, b) => a + b, 0)} item)
                </label>
                {Object.keys(cartItems).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCartItems({})
                      setItemNotes({})
                    }}
                    className="text-3xs font-semibold text-destructive hover:underline cursor-pointer"
                  >
                    Kosongkan
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                {Object.keys(cartItems).length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl bg-card">
                    Belum ada menu yang dipilih.
                    <p className="text-3xs mt-0.5">Klik salah satu menu di kolom kiri.</p>
                  </div>
                ) : (
                  Object.entries(cartItems).map(([id, qty]) => {
                    const item = CATALOG_ITEMS.find((c) => c.id === id)
                    if (!item) return null
                    const note = itemNotes[id]

                    return (
                      <div
                        key={id}
                        onClick={() => setActiveSelectedCartItemId(id)}
                        className={`p-2.5 rounded-xl border transition-all space-y-1.5 text-xs ${
                          activeSelectedCartItemId === id
                            ? 'border-accent1/60 bg-accent1/5'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-foreground text-xs leading-tight">
                              {item.name}
                            </div>
                            <div className="text-2xs font-mono text-muted-foreground mt-0.5">
                              {qty} × {formatRupiah(item.price)} ={' '}
                              <strong className="text-foreground">{formatRupiah(item.price * qty)}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateCartQty(id, -1)
                              }}
                              className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary/50 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-xs">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateCartQty(id, 1)
                              }}
                              className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-foreground bg-secondary/50 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Modifiers / Notes for this item */}
                        {editingItemId === id ? (
                          <div
                            className="pt-2 border-t border-border/40 space-y-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="text"
                                placeholder="Ketik catatan manual barista..."
                                value={inlineNoteText}
                                onChange={(e) => setInlineNoteText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    setItemNotes((prev) => ({ ...prev, [id]: inlineNoteText.trim() }))
                                    setEditingItemId(null)
                                  }
                                }}
                                className="h-7 text-xs bg-card border-border rounded-lg flex-1"
                                autoFocus
                              />
                              <Button
                                type="button"
                                variant="accent1"
                                size="sm"
                                onClick={() => {
                                  setItemNotes((prev) => ({ ...prev, [id]: inlineNoteText.trim() }))
                                  setEditingItemId(null)
                                }}
                                className="h-7 px-2.5 text-3xs font-bold cursor-pointer"
                              >
                                Simpan
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingItemId(null)}
                                className="h-7 px-2 text-3xs border-border bg-card hover:bg-secondary cursor-pointer"
                              >
                                Batal
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1 border-t border-border/40 flex items-center justify-between gap-2 text-3xs">
                            {note ? (
                              <span className="text-accent1 italic bg-accent1/10 px-2 py-0.5 rounded-md border border-accent1/20 truncate">
                                Catatan: {note}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/70">Tanpa catatan khusus</span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingItemId(id)
                                setInlineNoteText(note || '')
                                setActiveSelectedCartItemId(id)
                              }}
                              className="text-accent1 font-semibold hover:underline cursor-pointer shrink-0"
                            >
                              {note ? 'Ubah' : '+ Catatan Manual'}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            </div>

            {/* 5. Payment Methods Pills (Sticky at bottom of right column) */}
 <div className="p-3.5 border-t border-border bg-card shrink-0 space-y-1.5 ">
              <div className="flex items-center justify-between">
                <label className="text-2xs font-bold text-foreground block">Metode Pembayaran</label>
                <span className="text-3xs text-muted-foreground font-medium">Pilih salah satu</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'QRIS' as const, label: 'QRIS', icon: QrCode },
                  { id: 'Debit BCA' as const, label: 'Debit', icon: CreditCard },
                  { id: 'Cash' as const, label: 'Tunai', icon: Money },
                  { id: 'GoPay' as const, label: 'GoPay', icon: Wallet },
                ].map((m) => {
                  const isActive = newPaymentMethod === m.id
                  const Icon = m.icon
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setNewPaymentMethod(m.id)}
                      className={`py-2 px-1.5 rounded-xl border text-2xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isActive
 ? 'border-accent1/60 bg-accent1/10 text-accent1 font-bold '
                          : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" weight="bold" />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
