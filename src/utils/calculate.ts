import type { BillItem, SharedCosts, CalculationResult, PersonResult } from '@/types'

export function calculateSplit(
  items: BillItem[],
  sharedCosts: SharedCosts
): CalculationResult {
  const validItems = items.filter(
    (item) => item.personName.trim() && item.itemName.trim() && item.quantity > 0 && item.price > 0
  )

  const itemsSubtotal = validItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  const { discount, miscCost, shippingCost } = sharedCosts

  // Group items by person (first pass: compute subtotals, discount, misc per item)
  const personMap = new Map<string, PersonResult>()

  for (const item of validItems) {
    const subtotal = item.quantity * item.price
    const proportion = itemsSubtotal > 0 ? subtotal / itemsSubtotal : 0

    const discountShare = Math.round(discount * proportion)
    const miscCostShare = Math.round(miscCost * proportion)

    const personKey = item.personName.trim().toLowerCase()
    const existing = personMap.get(personKey)

    const itemResult = {
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
      subtotal,
      discountShare,
      miscCostShare,
      shippingShare: 0,
      finalAmount: subtotal - discountShare + miscCostShare,
    }

    if (existing) {
      existing.items.push(itemResult)
      existing.totalAmount += itemResult.finalAmount
    } else {
      personMap.set(personKey, {
        name: item.personName.trim(),
        items: [itemResult],
        totalAmount: itemResult.finalAmount,
      })
    }
  }

  // Second pass: split shipping equally per person
  const numPersons = personMap.size
  const shippingPerPerson = numPersons > 0 ? Math.round(shippingCost / numPersons) : 0

  for (const person of personMap.values()) {
    const personSubtotal = person.items.reduce((sum, it) => sum + it.subtotal, 0)

    for (const item of person.items) {
      const itemProportion = personSubtotal > 0 ? item.subtotal / personSubtotal : 0
      item.shippingShare = Math.round(shippingPerPerson * itemProportion)
      item.finalAmount += item.shippingShare
    }

    person.totalAmount += shippingPerPerson
  }

  const perPerson = Array.from(personMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const grandTotal = itemsSubtotal - discount + miscCost + shippingCost

  return {
    itemsSubtotal,
    totalDiscount: discount,
    totalMiscCost: miscCost,
    totalShipping: shippingCost,
    grandTotal,
    perPerson,
  }
}
