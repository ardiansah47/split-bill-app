# Split Bill Calculator

A mobile-first web app for splitting bills among friends. Add items per person, apply shared costs (discounts, misc fees, shipping), and get a fair breakdown instantly.

## Features

- **Per-item splitting** — Assign each menu item to a person with quantity and price
- **Restaurant name** — Optionally tag bills with a restaurant name
- **Shared costs** — Distribute discounts and misc costs proportionally; shipping splits equally per person
- **Auto-save history** — Every calculation is saved to localStorage with full detail
- **Share results** — Copy or share the breakdown via Web Share API
- **Smooth animations** — Page transitions and micro-interactions powered by Motion
- **Rupiah formatting** — Prices displayed in Indonesian Rupiah (Rp)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — Build tooling and dev server
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — UI components (Card, Button, AlertDialog, Collapsible)
- **Motion** (motion/react) — Page transitions and element animations
- **React Router v7** — Client-side routing
- **Lucide React** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  main.tsx                    # App entry point
  index.css                   # Global styles and Tailwind imports
  types.ts                    # Shared TypeScript interfaces

  components/
    AnimatedRoutes.tsx         # Route definitions with page transitions
    HomePage.tsx               # History list with delete/clear actions
    ResultsPage.tsx            # Calculation results with share functionality
    ItemCard.tsx               # Individual bill item form card
    SharedCostsCard.tsx        # Discount, misc cost, shipping inputs
    SummaryCard.tsx            # Live subtotal preview on create page
    ResultGroup.tsx            # Per-person result breakdown
    ui/                        # shadcn/ui primitives

  pages/
    CreatePage.tsx             # New bill form
    HistoryDetailPage.tsx      # View saved calculation by ID

  utils/
    calculate.ts               # Split calculation logic
    currency.ts                # Rupiah formatting and parsing
    storage.ts                 # localStorage CRUD operations
```

## How Splitting Works

1. Each item's subtotal (`quantity * price`) determines its proportion of the overall bill
2. **Discounts** and **misc costs** are distributed proportionally based on each item's share of the subtotal
3. **Shipping** is split equally per person, then distributed across that person's items proportionally

## License

MIT
