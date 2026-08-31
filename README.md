# MyLaw

A modern, professional legal-tech platform designed to simplify discovering and connecting with the right legal professionals. Built with Next.js 16, Tailwind CSS v4, and Shadcn UI.

## Overview

MyLaw is a pre-launch landing and waitlist platform built with a focus on trust, clarity, and premium design. It avoids generic SaaS aesthetics and typical legal clichés (no gavels or scales of justice) in favor of a clean, editorial, and highly trustworthy visual identity.

### Features
- **Responsive, Mobile-First Layout**: Fully fluid layouts utilizing modern Tailwind v4 container queries and `dvh` utilities.
- **Premium Design System**: Deep navy (`#172033`), soft grey, and restrained teal accents.
- **Glassmorphic Navigation**: Scroll-aware header that transitions from a transparent glass effect to solid frosted glass.
- **Dynamic Viewport Sizing**: Full-bleed hero and final CTA sections that lock perfectly to screen sizes on mobile and desktop.
- **Shadcn UI & Lucide Icons**: Accessible, polished form components and crisp professional iconography.
- **Seamless Footer Integration**: A dramatic, full-screen final CTA block with a perfectly integrated, dark-mode compact footer.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (using `@base-ui/react`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Inter (via `next/font/google`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- `src/app/page.tsx`: Main landing page assembling modular sections.
- `src/app/waitlist/page.tsx`: Dedicated minimal waitlist form page.
- `src/components/landing/*`: Modular landing page sections (Hero, Problem, How It Works, Why MyLaw, Who It's For, About, Final CTA).
- `src/components/ui/*`: Reusable Shadcn form components (Button, Input).
