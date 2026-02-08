import type { SavedCalculation } from "@/types";

const STORAGE_KEY = "split-bill-history";

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCalculation(entry: SavedCalculation): void {
  const list = getSavedCalculations();
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getCalculationById(id: string): SavedCalculation | undefined {
  return getSavedCalculations().find((c) => c.id === id);
}

export function deleteCalculation(id: string): void {
  const list = getSavedCalculations().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function clearAllCalculations(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
