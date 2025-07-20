# Zen Store

A modern e-commerce platform for laptop sales with AI-powered product management and USD to MNT price calculation.

## Features

- **Price Calculator**: Automatic USD to MNT conversion with CA tax, commission, and shipping fees
- **AI Product Generation**: Generate product descriptions and specifications using AI
- **Image Management**: Drag & drop image upload with preview
- **Admin Panel**: Complete product management system
- **Responsive Design**: Modern UI with Tailwind CSS

## Price Calculator

The admin panel includes a sophisticated price calculator that:

- Converts USD base prices to MNT using 3602.00 exchange rate
- Applies 8.25% CA tax
- Adds $100 commission fee
- Adds $20 shipping fee
- Auto-fills price fields and calculates discount percentage
- Shows detailed breakdown in real-time sidebar

### Example Calculation
For a $999 USD laptop:
- Base Price: $999.00
- CA Tax (8.25%): $82.42
- Commission Fee: $100.00
- Shipping Fee: $20.00
- **Total USD**: $1,201.42
- **Total MNT**: 4,327,511 MNT

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Language**: TypeScript

## Author

**Enkhbold Ganbold** - [GitHub](https://github.com/enkhbold470)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
