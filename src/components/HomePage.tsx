import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Trash2, ChevronRight, Users, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { SavedCalculation } from "@/types";
import { formatRupiah } from "@/utils/currency";
import { getSavedCalculations, deleteCalculation, clearAllCalculations } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();

  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function HomePage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SavedCalculation[]>(
    getSavedCalculations,
  );

  useEffect(() => {
    document.title = "Split Bill Calculator";
  }, []);

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setHistory(getSavedCalculations());
  };

  const handleClearAll = () => {
    clearAllCalculations();
    setHistory([]);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ReceiptIcon size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                Split Bill
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Calculator
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* History */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-muted-foreground" />
            <h2 className="text-sm font-bold text-foreground">History</h2>
            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md ml-auto">
              {history.length}
            </span>
            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={11} />
                    Clear
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {history.length} saved
                      calculation{history.length > 1 ? "s" : ""}. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {history.length === 0 ? (
            <Card className="text-center py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Receipt size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No history yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create your first split bill to get started
                  </p>
                </div>
              </div>
            </Card>
          ) : (
          <div className="space-y-3">
            <AnimatePresence initial={true}>
            {history.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 28, delay: index * 0.05 }}
              >
              <Card
                className="py-0 gap-0 cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${entry.id}`)}
                    className="flex-1 flex items-center gap-3 p-3.5 text-left min-w-0"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                      <Users size={15} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {entry.restaurantName || entry.label}
                      </p>
                      {entry.restaurantName && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {entry.result.perPerson.map((p) => p.name).join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-primary font-mono">
                          {formatRupiah(entry.result.grandTotal)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          &middot; {entry.result.perPerson.length} person
                          {entry.result.perPerson.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground"
                      />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                    className="p-3 text-muted-foreground hover:text-destructive transition-colors shrink-0 border-l"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
          )}
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
              onClick={() => navigate("/create")}
              size="lg"
              className="w-full h-11 text-sm font-semibold rounded-xl active:scale-[0.97] transition-all duration-200"
            >
              <Plus size={18} />
              New Split Bill
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReceiptIcon({
  size,
  className,
}: {
  size: number;
  className: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
