import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calculator, ArrowLeft, Store } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { BillItem, SharedCosts } from "@/types";
import { calculateSplit } from "@/utils/calculate";
import { saveCalculation } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ItemCard } from "@/components/ItemCard";
import { SharedCostsCard } from "@/components/SharedCostsCard";
import { SummaryCard } from "@/components/SummaryCard";

function createEmptyItem(): BillItem {
  return {
    id: crypto.randomUUID(),
    personName: "",
    itemName: "",
    quantity: 1,
    price: 0,
  };
}

export function CreatePage() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState<BillItem[]>([createEmptyItem()]);
  const [sharedCosts, setSharedCosts] = useState<SharedCosts>({
    discount: 0,
    miscCost: 0,
    shippingCost: 0,
  });
  useEffect(() => {
    document.title = "New Split Bill - Split Bill Calculator";
  }, []);

  const handleItemChange = useCallback(
    (id: string, field: keyof BillItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  const scrollToNewItem = useRef(false);

  const handleAddItem = useCallback(() => {
    const newItem = createEmptyItem();
    setItems((prev) => [...prev, newItem]);
    scrollToNewItem.current = true;
  }, []);

  useEffect(() => {
    if (scrollToNewItem.current) {
      scrollToNewItem.current = false;
      const lastId = items[items.length - 1]?.id;
      if (lastId) {
        document.getElementById(`item-${lastId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [items]);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSharedCostChange = useCallback(
    (field: keyof SharedCosts, value: number) => {
      setSharedCosts((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const validate = (): string[] => {
    const errs: string[] = [];
    const hasValidItem = items.some(
      (item) =>
        item.personName.trim() &&
        item.itemName.trim() &&
        item.quantity > 0 &&
        item.price > 0,
    );
    if (!hasValidItem) {
      errs.push(
        "Please add at least one complete item with person name, item name, quantity, and price.",
      );
    }

    items.forEach((item, i) => {
      const hasAnyInput = item.personName || item.itemName || item.price > 0;
      if (hasAnyInput) {
        if (!item.personName.trim())
          errs.push(`Item #${i + 1}: Person name is required.`);
        if (!item.itemName.trim())
          errs.push(`Item #${i + 1}: Item name is required.`);
        if (item.quantity <= 0)
          errs.push(`Item #${i + 1}: Quantity must be greater than 0.`);
        if (item.price <= 0)
          errs.push(`Item #${i + 1}: Price must be greater than 0.`);
      }
    });

    return errs;
  };

  const handleCalculate = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const result = calculateSplit(items, sharedCosts);

    const names = result.perPerson.map((p) => p.name).join(", ");
    const label = restaurantName.trim()
      ? restaurantName.trim()
      : names.length > 30
        ? names.substring(0, 30) + "..."
        : names;
    const id = crypto.randomUUID();

    saveCalculation({
      id,
      label,
      ...(restaurantName.trim() && { restaurantName: restaurantName.trim() }),
      createdAt: new Date().toISOString(),
      result,
    });

    navigate(`/history/${id}`);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-sm font-bold text-foreground">New Split Bill</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Restaurant Name */}
        <section>
          <Card className="p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <Store size={15} className="text-primary" />
              </div>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Sushi Tei, McDonald's"
                className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
          </Card>
        </section>

        {/* Items Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Items</h2>
            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {items.length} item{items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  canRemove={items.length > 1}
                />
              ))}
            </AnimatePresence>
          </div>
          <Button
            variant="outline"
            onClick={handleAddItem}
            className="mt-3 w-full h-9 border-dashed border-2 text-primary border-primary bg-primary-light/30 hover:text-primary"
          >
            <Plus size={16} />
            Add Item
          </Button>
        </section>

        {/* Shared Costs */}
        <section>
          <SharedCostsCard
            costs={sharedCosts}
            onChange={handleSharedCostChange}
          />
        </section>

        {/* Summary */}
        <section>
          <SummaryCard items={items} sharedCosts={sharedCosts} />
        </section>

      </main>

      {/* Bottom Action Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.5,
        }}
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-card border border-b-0 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 pt-4 pb-6">
            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full h-11 text-sm font-semibold rounded-xl active:scale-[0.97] transition-all duration-200"
            >
              <Calculator size={18} />
              Calculate Split
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
