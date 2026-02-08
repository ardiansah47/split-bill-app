import { BadgePercent, Package, Truck } from 'lucide-react'
import type { SharedCosts } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SharedCostsCardProps {
  costs: SharedCosts
  onChange: (field: keyof SharedCosts, value: number) => void
}

export function SharedCostsCard({ costs, onChange }: SharedCostsCardProps) {
  const fields = [
    {
      key: 'discount' as keyof SharedCosts,
      label: 'Total Discount',
      icon: BadgePercent,
      value: costs.discount,
      color: 'text-destructive',
      bgColor: 'bg-danger-light',
    },
    {
      key: 'miscCost' as keyof SharedCosts,
      label: 'Misc. Cost',
      icon: Package,
      value: costs.miscCost,
      color: 'text-secondary',
      bgColor: 'bg-secondary-light',
    },
    {
      key: 'shippingCost' as keyof SharedCosts,
      label: 'Shipping Cost',
      icon: Truck,
      value: costs.shippingCost,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Shared Costs</CardTitle>
        <CardDescription className="text-xs">
          Prorated proportionally across all items
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${field.bgColor}`}>
              <field.icon size={15} className={field.color} />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={`shared-${field.key}`} className="text-xs text-muted-foreground">
                {field.label}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground font-mono">
                  Rp
                </span>
                <Input
                  id={`shared-${field.key}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={field.value || ''}
                  onChange={(e) => onChange(field.key, parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 pl-9 bg-muted/50 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
