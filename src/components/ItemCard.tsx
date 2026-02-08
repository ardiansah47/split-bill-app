import { Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { BillItem } from '@/types'
import { formatRupiah } from '@/utils/currency'
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ItemCardProps {
  item: BillItem
  index: number
  onChange: (id: string, field: keyof BillItem, value: string | number) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export function ItemCard({ item, index, onChange, onRemove, canRemove }: ItemCardProps) {
  const subtotal = item.quantity * item.price

  return (
    <motion.div
      id={`item-${item.id}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: index * 0.05 }}
    >
    <Card
      className="transition-all duration-200 hover:shadow-md"
    >
      <CardHeader>
        <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
          Item #{index + 1}
        </CardTitle>
        {canRemove && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove item ${index + 1}`}
              className="text-muted-foreground hover:text-destructive hover:bg-danger-light"
            >
              <Trash2 size={14} />
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`person-${item.id}`} className="text-xs text-muted-foreground">
              Person Name
            </Label>
            <Input
              id={`person-${item.id}`}
              type="text"
              value={item.personName}
              onChange={(e) => onChange(item.id, 'personName', e.target.value)}
              placeholder="e.g. Andi"
              className="h-9 bg-muted/50 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`item-${item.id}`} className="text-xs text-muted-foreground">
              Item Name
            </Label>
            <Input
              id={`item-${item.id}`}
              type="text"
              value={item.itemName}
              onChange={(e) => onChange(item.id, 'itemName', e.target.value)}
              placeholder="e.g. Nasi Goreng"
              className="h-9 bg-muted/50 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground">
                Quantity
              </Label>
              <Input
                id={`qty-${item.id}`}
                type="number"
                inputMode="numeric"
                min={1}
                value={item.quantity || ''}
                onChange={(e) => onChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                placeholder="1"
                className="h-9 bg-muted/50 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`price-${item.id}`} className="text-xs text-muted-foreground">
                Price (IDR)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground font-mono">
                  Rp
                </span>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={item.price || ''}
                  onChange={(e) => onChange(item.id, 'price', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 pl-9 bg-muted/50 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {subtotal > 0 && (
        <CardFooter className="border-t justify-between">
          <span className="text-xs text-muted-foreground">Subtotal</span>
          <span className="text-sm font-semibold text-primary font-mono">
            {formatRupiah(subtotal)}
          </span>
        </CardFooter>
      )}
    </Card>
    </motion.div>
  )
}
