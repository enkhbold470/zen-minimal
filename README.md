# 💻 Zen Store

> Modern e-commerce platform for laptop sales with AI-powered product management and automatic USD to MNT price calculation.

## ✨ Features

- 💰 **Smart Price Calculator** - Automatic USD to MNT conversion with CA tax, commission, and shipping fees
- 🤖 **AI Product Generation** - Generate product descriptions and specifications using AI
- 🖼️ **Image Management** - Drag & drop image upload with preview
- 🔐 **Admin Panel** - Complete product management system (CRUD operations)
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🛒 **Order Management** - Track and manage customer orders

## 🧮 Price Calculator

Automatically calculates final prices with:

- 💵 **USD to MNT Conversion** - Exchange rate: 3602.00 MNT/USD
- 📊 **CA Tax** - 8.25% applied to base price
- 💼 **Commission Fee** - $100 flat fee
- 📦 **Shipping Fee** - $20 flat fee
- 🎯 **Auto-calculation** - Real-time price breakdown in sidebar
- 💸 **Discount Calculator** - Automatic discount percentage calculation

### 📝 Example Calculation

**Input:** $999 USD laptop

```
Base Price:        $999.00
CA Tax (8.25%):    $82.42
Commission Fee:    $100.00
Shipping Fee:      $20.00
───────────────────────────
Total USD:         $1,201.42
Total MNT:         4,327,511 MNT
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm installed

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

🌐 Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) ⚛️
- **Styling:** Tailwind CSS + Shadcn/ui 🎨
- **Icons:** Lucide React 🔷
- **Package Manager:** pnpm 📦
- **Language:** TypeScript 📘
- **Database:** Serverless Postgres Neon 🐘
- **ORM:** Prisma 🗄️
- **Auth:** Clerk 🔒
- **LLM:** Claude 4 Sonnet, Gemini 2.5 🤖

## 📁 Project Structure

```
app/           # Next.js app router pages
components/    # Reusable UI components
actions/       # Server actions
lib/           # Utilities and Prisma client
prisma/        # Database schema
```

## 👤 Author

**Enkhbold Ganbold** 👨‍💻

- [GitHub](https://github.com/enkhbold470) 🐙

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) 📖
- [Learn Next.js](https://nextjs.org/learn) 🎓
- [Next.js GitHub](https://github.com/vercel/next.js) ⭐

## 🚢 Deployment

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) ☁️

Check the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
