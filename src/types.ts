export interface BillItem {
  id: string
  personName: string
  itemName: string
  quantity: number
  price: number
}

export interface SharedCosts {
  discount: number
  miscCost: number
  shippingCost: number
}

export interface PersonResult {
  name: string
  items: {
    itemName: string
    quantity: number
    price: number
    subtotal: number
    discountShare: number
    miscCostShare: number
    shippingShare: number
    finalAmount: number
  }[]
  totalAmount: number
}

export interface CalculationResult {
  itemsSubtotal: number
  totalDiscount: number
  totalMiscCost: number
  totalShipping: number
  grandTotal: number
  perPerson: PersonResult[]
}

export interface SavedCalculation {
  id: string
  label: string
  restaurantName?: string
  createdAt: string
  result: CalculationResult
}
