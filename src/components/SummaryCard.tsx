import type { BillItem, SharedCosts } from '@/types'
import { formatRupiah } from '@/utils/currency'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

interface SummaryCardProps {
  items: BillItem[]
  sharedCosts: SharedCosts
}

export function SummaryCard({ items, sharedCosts }: SummaryCardProps) {
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
  const grandTotal =
    itemsSubtotal - sharedCosts.discount + sharedCosts.miscCost + sharedCosts.shippingCost

  const rows = [
    { label: 'Items Subtotal', value: itemsSubtotal, type: 'neutral' as const },
    { label: 'Discount', value: -sharedCosts.discount, type: 'discount' as const },
    { label: 'Misc. Cost', value: sharedCosts.miscCost, type: 'neutral' as const },
    { label: 'Shipping Cost', value: sharedCosts.shippingCost, type: 'neutral' as const },
  ]

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-sm">Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span
              className={`text-xs font-mono font-medium ${
                row.type === 'discount' && row.value < 0
                  ? 'text-destructive'
                  : 'text-foreground'
              }`}
            >
              {row.type === 'discount' && row.value < 0 ? '- ' : ''}
              {formatRupiah(Math.abs(row.value))}
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-dashed justify-between">
        <span className="text-xs font-bold text-foreground">Grand Total</span>
        <span className="text-sm font-bold text-primary font-mono">
          {formatRupiah(grandTotal)}
        </span>
      </CardFooter>
    </Card>
  )
}
