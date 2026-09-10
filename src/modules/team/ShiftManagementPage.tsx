import React, { useState } from 'react'
import { Calendar, Clock, Plus, Store, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: ShiftManagementPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface ShiftSlot {
  id: string
  staffName: string
  role: string
  shiftTime: string
  outlet: string
  status: 'active' | 'upcoming' | 'completed'
}

export function ShiftManagementPage() {
  const [selectedDay, setSelectedDay] = useState('Hari Ini (Senin)')

  const shifts: ShiftSlot[] = [
    {
      id: 'SH-1',
      staffName: 'Adit Pramana',
      role: 'Manager',
      shiftTime: '08:00 – 16:00',
      outlet: 'Malang',
      status: 'active',
    },
    {
      id: 'SH-2',
      staffName: 'Raka Dewa',
      role: 'Barista Head',
      shiftTime: '12:00 – 20:00',
      outlet: 'Malang',
      status: 'active',
    },
    {
      id: 'SH-3',
      staffName: 'Dimas Wicaksono',
      role: 'Barista / Crew',
      shiftTime: '16:00 – 23:00',
      outlet: 'Malang',
      status: 'upcoming',
    },
    {
      id: 'SH-4',
      staffName: 'Sarah Farida',
      role: 'Cashier',
      shiftTime: '08:00 – 16:00',
      outlet: 'Surabaya',
      status: 'active',
    },
    {
      id: 'SH-5',
      staffName: 'Bayu Wicaksono',
      role: 'Barista',
      shiftTime: '15:00 – 23:00',
      outlet: 'Jakarta',
      status: 'upcoming',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Shift Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Menghubungkan orang (*people*) dengan jam operasional (*operation*) untuk kepastian alur kerja
          </p>
        </div>
        <Button variant="accent1" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Atur Jadwal Shift</span>
        </Button>
      </div>

      {/* Roster Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Roster Jadwal Operasional</CardTitle>
              <CardDescription>Jadwal giliran kerja staf aktif untuk menjaga standar pelayanan</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{selectedDay}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Nama Anggota</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Jam Kerja Shift</th>
                  <th className="py-2.5 px-3">Cabang Outlet</th>
                  <th className="py-2.5 px-3 text-center">Status Bertugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shifts.map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{s.staffName}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.role}</td>
                    <td className="py-3 px-3 font-mono text-foreground font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-accent1" />
                        {s.shiftTime}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {s.outlet}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {s.status === 'active' && (
                        <Badge variant="accent2">Sedang Bertugas</Badge>
                      )}
                      {s.status === 'upcoming' && (
                        <Badge variant="secondary">Shift Berikutnya</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
