import { ChevronDown, User, Receipt } from 'lucide-react'
import type { PersonResult } from '@/types'
import { formatRupiah } from '@/utils/currency'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

interface ResultGroupProps {
  result: PersonResult
  index: number
}

export function ResultGroup({ result, index }: ResultGroupProps) {
  return (
    <Card
      className="animate-fade-in-up overflow-hidden transition-all duration-200 hover:shadow-md py-0 gap-0"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Collapsible>
        <CollapsibleTrigger className="w-full cursor-pointer">
          <div className="flex items-center justify-between text-left p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{result.name}</h3>
                <p className="text-[11px] text-muted-foreground">
                  {result.items.length} item{result.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary font-mono">
                {formatRupiah(result.totalAmount)}
              </span>
              <ChevronDown
                size={16}
                className="text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180"
              />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="border-t pt-3 space-y-2">
              {result.items.map((item, i) => (
                <div key={i} className="bg-muted rounded-lg p-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Receipt size={13} className="text-muted-foreground mt-0.5" />
                      <span className="text-xs font-medium text-foreground">{item.itemName}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-foreground">
                      {formatRupiah(item.finalAmount)}
                    </span>
                  </div>
                  <div className="ml-5 space-y-0.5">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{item.quantity} x {formatRupiah(item.price)}</span>
                      <span className="font-mono">{formatRupiah(item.subtotal)}</span>
                    </div>
                    {item.discountShare > 0 && (
                      <div className="flex justify-between text-[11px] text-destructive">
                        <span>Discount share</span>
                        <span className="font-mono">- {formatRupiah(item.discountShare)}</span>
                      </div>
                    )}
                    {item.miscCostShare > 0 && (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Misc. cost share</span>
                        <span className="font-mono">+ {formatRupiah(item.miscCostShare)}</span>
                      </div>
                    )}
                    {item.shippingShare > 0 && (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Shipping share</span>
                        <span className="font-mono">+ {formatRupiah(item.shippingShare)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-primary-light rounded-lg p-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Prorated Total
                </span>
                <span className="text-xs font-bold text-primary font-mono">
                  {formatRupiah(result.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
