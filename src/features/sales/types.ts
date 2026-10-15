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

export interface TableDef {
  id: string
  number: string
  label: string
  capacity: number
  zone: 'Indoor Utama' | 'Window Bar' | 'Outdoor Terrace'
}

export const CATALOG_ITEMS: CatalogItem[] = [
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

export const QUICK_MODIFIERS = [
  'Less Sweet',
  'No Sugar',
  'Less Ice',
  'Oat Milk',
  'Extra Shot',
  'Hangatkan',
]

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

export const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`
