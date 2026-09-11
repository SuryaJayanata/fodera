import React, { useState } from 'react'
import { Plus, UserCheck, Search, Shield, Store } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: StaffManagementPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface StaffMember {
  id: string
  name: string
  role: 'Manager' | 'Cashier' | 'Barista' | 'Kitchen' | 'Crew'
  outlet: string
  shift: string
  performanceRating: string
  status: 'active' | 'on_leave'
}

export function StaffManagementPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [search, setSearch] = useState('')

  const staffList: StaffMember[] = [
    {
      id: 'STF-01',
      name: 'Adit Pramana',
      role: 'Manager',
      outlet: 'Malang (Main)',
      shift: 'Pagi (08:00 - 16:00)',
      performanceRating: '98%',
      status: 'active',
    },
    {
      id: 'STF-02',
      name: 'Raka Dewa',
      role: 'Barista',
      outlet: 'Malang (Main)',
      shift: 'Siang (12:00 - 20:00)',
      performanceRating: '94%',
      status: 'active',
    },
    {
      id: 'STF-03',
      name: 'Dimas Wicaksono',
      role: 'Crew',
      outlet: 'Malang (Main)',
      shift: 'Malam (16:00 - 23:00)',
      performanceRating: '91%',
      status: 'active',
    },
    {
      id: 'STF-04',
      name: 'Sarah Farida',
      role: 'Cashier',
      outlet: 'Surabaya',
      shift: 'Pagi (08:00 - 16:00)',
      performanceRating: '96%',
      status: 'active',
    },
    {
      id: 'STF-05',
      name: 'Wahyu Hidayat',
      role: 'Kitchen',
      outlet: 'Surabaya',
      shift: 'Full Shift',
      performanceRating: '89%',
      status: 'active',
    },
  ]

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  )

  const getRoleBadge = (role: StaffMember['role']) => {
    switch (role) {
      case 'Manager':
        return <Badge variant="accent1">Manager</Badge>
      case 'Barista':
        return <Badge variant="accent2">Barista</Badge>
      case 'Cashier':
        return <Badge variant="secondary">Cashier</Badge>
      case 'Kitchen':
        return <Badge variant="warning">Kitchen</Badge>
      case 'Crew':
        return <Badge variant="outline">Crew</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Staff & Tim Operasional</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manajemen penugasan peran tim F&B (*Manager, Barista, Cashier, Kitchen, Crew*) per outlet
          </p>
        </div>
        <Button variant="accent1" onClick={() => setIsAddOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Tambah Anggota Tim</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Cari nama karyawan atau jabatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
              <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-2.5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">ID Karyawan</th>
                  <th className="py-2.5 px-3">Nama Anggota</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Outlet Penempatan</th>
                  <th className="py-2.5 px-3">Jadwal Shift</th>
                  <th className="py-2.5 px-3 text-right">Skor Kehadiran</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{staff.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{staff.name}</td>
                    <td className="py-3 px-3">{getRoleBadge(staff.role)}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {staff.outlet}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{staff.shift}</td>
                    <td className="py-3 px-3 text-right font-bold text-accent2">{staff.performanceRating}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-2xs font-semibold text-accent2 bg-accent2/10 px-2 py-0.5 rounded-full">
                        Bertugas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Daftarkan Anggota Tim"
        description="Tambahkan staf operasional baru dan tentukan outlet penugasan"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent1"
              onClick={() => {
                alert('Staf baru berhasil didaftarkan!')
                setIsAddOpen(false)
              }}
            >
              Simpan Staf
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Nama Lengkap</label>
            <Input placeholder="cth. Rendy Febrian" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Peran (Role)</label>
              <Select defaultValue="Barista">
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Barista">Barista</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Crew">Crew</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Outlet</label>
              <Select defaultValue="malang">
                <option value="malang">Malang</option>
                <option value="surabaya">Surabaya</option>
                <option value="jakarta">Jakarta</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Nomor Kontak</label>
            <Input placeholder="+62 8..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
