import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Trash2, ChevronRight, Users, Receipt } from "lucide-react";
import type { SavedCalculation } from "@/types";
import { formatRupiah } from "@/utils/currency";
import { getSavedCalculations, deleteCalculation, clearAllCalculations } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setHistory(getSavedCalculations());
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Receipt size={18} className="text-primary-foreground" />
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

            {history.length > 0 && (
              <>
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md ml-auto">
                  {history.length}
                </span>

                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors px-2 py-0.5 rounded-md hover:bg-muted/50"
                    aria-label="Clear all history"
                  >
                    <Trash2 size={11} />
                    <span>Clear</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 animate-fade-in-up">
                    <button
                      type="button"
                      onClick={() => {
                        clearAllCalculations();
                        setHistory([]);
                        setShowClearConfirm(false);
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-destructive hover:text-destructive/80 transition-colors px-2 py-0.5 rounded-md bg-destructive/10 hover:bg-destructive/15"
                      aria-label="Confirm clear all"
                    >
                      <Trash2 size={11} />
                      <span>Confirm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded-md hover:bg-muted"
                      aria-label="Cancel clear"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
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
          <div className="space-y-2">
            {history.map((entry, index) => (
              <Card
                key={entry.id}
                className="animate-fade-in-up py-0 gap-0 cursor-pointer hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 40}ms` }}
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
                        {entry.label}
                      </p>
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
            ))}
          </div>
          )}
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
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
      </div>
    </div>
  );
}
