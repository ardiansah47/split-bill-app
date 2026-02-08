import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  User,
  Receipt,
  ChevronDown,
  Store,
} from "lucide-react";
import type { CalculationResult } from "@/types";
import { formatRupiah } from "@/utils/currency";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface ResultsPageProps {
  result: CalculationResult;
  restaurantName?: string;
  createdAt?: string;
  onBack: () => void;
}

function buildShareText(result: CalculationResult): string {
  let text = "Split Bill Results\n";
  text += "══════════════════\n\n";

  for (const person of result.perPerson) {
    text += `${person.name}: ${formatRupiah(person.totalAmount)}\n`;
    for (const item of person.items) {
      text += `  - ${item.itemName} (${item.quantity}x) ${formatRupiah(item.finalAmount)}\n`;
    }
    text += "\n";
  }

  text += "──────────────────\n";
  text += `Subtotal: ${formatRupiah(result.itemsSubtotal)}\n`;
  if (result.totalDiscount > 0)
    text += `Discount: -${formatRupiah(result.totalDiscount)}\n`;
  if (result.totalMiscCost > 0)
    text += `Misc. Cost: +${formatRupiah(result.totalMiscCost)}\n`;
  if (result.totalShipping > 0)
    text += `Shipping: +${formatRupiah(result.totalShipping)}\n`;
  text += `Grand Total: ${formatRupiah(result.grandTotal)}`;

  return text;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function ResultsPage({
  result,
  restaurantName,
  createdAt,
  onBack,
}: ResultsPageProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = restaurantName
      ? `${restaurantName} - Split Bill Calculator`
      : "Split Results - Split Bill Calculator";
  }, [restaurantName]);

  const handleShare = async () => {
    const text = buildShareText(result);

    if (navigator.share) {
      try {
        await navigator.share({ title: "Split Bill Result", text });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-sm font-bold text-foreground">Split Results</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Grand Total Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
        >
          <Card className="text-center py-5 gap-0">
            {restaurantName && (
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <Store size={14} className="text-primary" />
                <span className="text-sm font-bold text-primary">
                  {restaurantName}
                </span>
              </div>
            )}
            <p className="text-3xl font-extrabold text-primary font-mono tracking-tight">
              {formatRupiah(result.grandTotal)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Split between {result.perPerson.length} person
              {result.perPerson.length > 1 ? "s" : ""}
              {createdAt && (
                <span> &middot; {formatDate(createdAt)}</span>
              )}
            </p>
          </Card>
        </motion.div>

        {/* Per Person */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3">
            Per Person
          </h2>
          <div className="space-y-3">
            {result.perPerson.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.2 + index * 0.08 }}
              >
              <Card
                className="overflow-hidden py-0 gap-0"
              >
                <Collapsible>
                  <CollapsibleTrigger className="w-full cursor-pointer">
                    <div className="flex items-center justify-between text-left p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                          <User size={16} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {person.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            {person.items.length} item
                            {person.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary font-mono">
                          {formatRupiah(person.totalAmount)}
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
                        {person.items.map((item, i) => (
                          <div key={i} className="bg-muted rounded-lg p-3">
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <Receipt
                                  size={13}
                                  className="text-muted-foreground mt-0.5"
                                />
                                <span className="text-xs font-medium text-foreground">
                                  {item.itemName}
                                </span>
                              </div>
                              <span className="text-xs font-bold font-mono text-foreground">
                                {formatRupiah(item.finalAmount)}
                              </span>
                            </div>
                            <div className="ml-5 space-y-0.5">
                              <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>
                                  {item.quantity} x{" "}
                                  {formatRupiah(item.price)}
                                </span>
                                <span className="font-mono">
                                  {formatRupiah(item.subtotal)}
                                </span>
                              </div>
                              {item.discountShare > 0 && (
                                <div className="flex justify-between text-[11px] text-destructive">
                                  <span>Discount share</span>
                                  <span className="font-mono">
                                    - {formatRupiah(item.discountShare)}
                                  </span>
                                </div>
                              )}
                              {item.miscCostShare > 0 && (
                                <div className="flex justify-between text-[11px] text-muted-foreground">
                                  <span>Misc. cost share</span>
                                  <span className="font-mono">
                                    + {formatRupiah(item.miscCostShare)}
                                  </span>
                                </div>
                              )}
                              {item.shippingShare > 0 && (
                                <div className="flex justify-between text-[11px] text-muted-foreground">
                                  <span>Shipping share</span>
                                  <span className="font-mono">
                                    + {formatRupiah(item.shippingShare)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Summary Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.2 + result.perPerson.length * 0.08 + 0.08 }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Items Subtotal
              </span>
              <span className="text-xs font-mono font-medium text-foreground">
                {formatRupiah(result.itemsSubtotal)}
              </span>
            </div>
            {result.totalDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Discount
                </span>
                <span className="text-xs font-mono font-medium text-destructive">
                  - {formatRupiah(result.totalDiscount)}
                </span>
              </div>
            )}
            {result.totalMiscCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Misc. Cost
                </span>
                <span className="text-xs font-mono font-medium text-foreground">
                  {formatRupiah(result.totalMiscCost)}
                </span>
              </div>
            )}
            {result.totalShipping > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Shipping Cost
                </span>
                <span className="text-xs font-mono font-medium text-foreground">
                  {formatRupiah(result.totalShipping)}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-dashed justify-between">
            <span className="text-xs font-bold text-foreground">
              Grand Total
            </span>
            <span className="text-sm font-bold text-primary font-mono">
              {formatRupiah(result.grandTotal)}
            </span>
          </CardFooter>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Discounts and shared costs are prorated based on each item&apos;s
          proportion of the subtotal.
        </p>
        </motion.div>
      </main>

      {/* Bottom Action Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.25,
        }}
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-card border border-b-0 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 pt-4 pb-6">
            <Button
              onClick={handleShare}
              size="lg"
              className="w-full h-11 text-sm font-semibold rounded-xl active:scale-[0.97] transition-all duration-200"
            >
              {copied ? (
                <Check size={16} />
              ) : typeof navigator.share === "function" ? (
                <Share2 size={16} />
              ) : (
                <Copy size={16} />
              )}
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
