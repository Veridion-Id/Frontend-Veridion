# 🌟 Veridion - Stellar Passport

> **The Stellar Passport** - A universal identity credential that proves users are real humans and lets their trust travel across the Stellar network.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-7D00FF?style=for-the-badge&logo=stellar)](https://stellar.org/)
[![HackMeridian 2025](https://img.shields.io/badge/HackMeridian-2025-FF6B6B?style=for-the-badge)](https://hackmeridian.stellar.org/)

## 🎯 Mission

**Building the Stellar Passport: a reusable, unified identity layer for the Stellar ecosystem.**

🏆 **Built during HackMeridian 2025**

## ⚠️ The Problem

- **Fragmented KYC** → every app runs its own checks, forcing users to re-verify again and again
- **Bots & AI** → over 40% of internet traffic is non-human, threatening fair access to rewards
- **Compliance Failures** → 30% of providers were fined in 2024 for mishandling identity
- **Competitive Pressure** → Ethereum has Gitcoin Passport, Polygon has Polygon ID - Stellar risks falling behind

## ✅ Our Solution

**Veridion is the Stellar Passport.**

- **Verify once, use everywhere** – one KYC, reusable across all Stellar apps
- **Proof of Humanness** – stop bots and AI from gaming the system
- **On-Chain Reputation** – portable trust scores for fairer access
- **Simple API integration** – any Stellar app can add compliance in minutes

## 🚀 What is Veridion?

Veridion is the Stellar Passport - a universal identity credential that proves users are real humans and lets their trust travel across the network.

### 🎯 **Human Score Dashboard**
This application is where users build their **Human Score** through various verification methods:

- **Social Media**: GitHub, LinkedIn, Discord, Google
- **Blockchain**: Stellar network transaction verification  
- **Physical**: Identity and document verification
- **Points System**: Gamified verification with tiered rewards

### 💰 **Stellar Integration**
- **Transaction Analysis**: Count and analyze Stellar transactions
- **Wallet Integration**: Connect and verify Stellar wallets

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Blockchain**: Stellar SDK

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/veridion-dashboard.git
   cd veridion-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Stellar Network
   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   
   # Social Media APIs (optional)
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
   NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard page
│   ├── verifications/           # API routes
│   └── layout.tsx              # Root layout
├── features/                    # Feature-based architecture
│   ├── dashboard/              # Dashboard components
│   ├── verifications/          # Verification system
│   │   ├── components/         # Verification components
│   │   ├── constants/          # Configuration data
│   │   ├── hooks/              # Custom hooks
│   │   └── store/              # State management
│   ├── stellar/                # Stellar blockchain integration
│   └── wallet/                 # Wallet connection
├── shared/                      # Shared components and utilities
│   ├── components/             # Reusable UI components
│   ├── ui/                     # Base UI components
│   └── hooks/                  # Shared hooks
└── lib/                        # Utility functions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎯 How to Build Your Human Score

1. **Connect Your Stellar Wallet** - Start building your identity
2. **Verify Social Media Accounts** - Prove account ownership (GitHub, LinkedIn, etc.)
3. **Verify Stellar Activity** - Connect wallet and earn points based on transaction history
4. **Complete Physical Verifications** - Prove real-world identity
5. **Track Your Human Score** - Monitor cumulative verification status and trust levels


## 🔮 Roadmap

- [ ] **API/SDK for Businesses**: Plug-in compliance in minutes
- [ ] **On-Chain Reputation**: Portable trust scores for lending
- [ ] **Mobile App**: React Native companion app
- [ ] **Multi-chain Support**: Ethereum, Polygon, Solana

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Veridion makes Stellar safer, more inclusive, and human-first. 🚀**

**Built with ❤️ during HackMeridian 2025**

[⭐ Star this repo](https://github.com/yourusername/veridion-dashboard) | [🐛 Report Bug](https://github.com/yourusername/veridion-dashboard/issues) | [💡 Request Feature](https://github.com/yourusername/veridion-dashboard/issues)

</div>