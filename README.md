# 🌟 Veridion - Stellar Passport

> **The Stellar Passport** - A universal identity credential that proves users are real humans and lets their trust travel across the Stellar network.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-7D00FF?style=for-the-badge&logo=stellar)](https://stellar.org/)
[![HackMeridian 2025](https://img.shields.io/badge/HackMeridian-2025-FF6B6B?style=for-the-badge)](https://hackmeridian.stellar.org/)

## 🎯 Mission

**Building the Stellar Passport: a reusable, unified identity layer for the Stellar ecosystem.**

🏆 **Built during HackMeridian 2025**

## ⚠️ The Problem

- **Fragmented KYC** → every app runs its own checks, forcing users to re-verify again and again
- **High Risk** → 80% chance of data breaches when companies handle KYC in-house
- **Bots & AI** → over 40% of internet traffic is non-human, threatening fair access to rewards, credit, and governance
- **Compliance Failures** → 30% of providers were fined in 2024 for mishandling identity
- **Competitive Pressure** → Ethereum has Gitcoin Passport, Polygon has Polygon ID - Stellar risks falling behind

## ✅ Our Solution

**Veridion is the Stellar Passport.**

- **Verify once, use everywhere** – one KYC, reusable across all Stellar apps
- **Proof of Humanness** – stop bots and AI from gaming the system
- **On-Chain Reputation** – portable trust scores that open access to lending and services
- **API/SDK for Businesses** – plug in compliance and trust in minutes, without storing sensitive documents

👉 **Simple. Private. Scalable.**

## 🚀 What is Veridion?

Veridion is the Stellar Passport - a universal identity credential that proves users are real humans and lets their trust travel across the network.

### 🎯 **Human Score Dashboard**
This application is where users build their **Human Score** through various verification methods:

### 🔐 **Multi-Platform Verification**
- **Social Media**: GitHub, LinkedIn, Discord, Google
- **Blockchain**: Stellar network transaction verification  
- **Physical**: Identity and document verification
- **Points System**: Gamified verification with tiered rewards

### 💰 **Stellar Blockchain Integration**
- **Transaction Analysis**: Count and analyze Stellar transactions
- **Wallet Integration**: Connect and verify Stellar wallets
- **Human Score Tiers**:
  - 🥉 **Stellar Beginner** (1+ transactions) - 1 point
  - 🥈 **Stellar User** (5+ transactions) - 5 points
  - 🥇 **Stellar Active** (10+ transactions) - 10 points
  - 💎 **Stellar Pro** (25+ transactions) - 15 points
  - 🏆 **Stellar Expert** (50+ transactions) - 25 points
  - 👑 **Stellar Master** (100+ transactions) - 50 points

### 🎯 **Human Score System**
- **Cumulative Points**: All verifications contribute to your Human Score
- **Portable Identity**: Your score travels with you across Stellar apps
- **Trust Levels**: Higher scores unlock more features and services
- **Anti-Bot Protection**: Proves you're a real human, not AI or bot

### 🎨 **Modern UI/UX**
- **Dark Theme**: Sleek, professional design
- **Responsive**: Mobile-first approach
- **Interactive Modals**: Smooth verification flows
- **Real-time Updates**: Live verification status
- **Progress Tracking**: Visual progress indicators

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Blockchain**: [Stellar SDK](https://stellar.org/developers/js-stellar-sdk)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: [Inter](https://fonts.google.com/specimen/Inter)

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

## 🌐 API Endpoints

### Verification Routes
- `POST /verifications/github` - GitHub account verification
- `POST /verifications/linkedin` - LinkedIn account verification
- `POST /verifications/discord` - Discord account verification
- `POST /verifications/google` - Google account verification

### Stellar Integration
- **Network**: Testnet (horizon-testnet.stellar.org)
- **Mainnet**: horizon.stellar.org
- **Features**: Account info, transaction history, balance checking

## 🎯 How to Build Your Human Score

### 1. **Connect Your Stellar Wallet**
- Click "Connect Wallet" in the header
- Select your preferred wallet provider
- Authorize the connection to start building your identity

### 2. **Verify Social Media Accounts**
- Navigate to "Social Media Verification"
- Click on any platform (GitHub, LinkedIn, Discord, Google)
- Follow the OAuth flow to prove account ownership
- Earn points based on account activity and age

### 3. **Verify Stellar Blockchain Activity**
- Go to "Blockchain Verification"
- Click "Stellar Transactions"
- Your connected wallet will be auto-detected
- View transaction count and earn points based on activity level

### 4. **Complete Physical Verifications**
- Navigate to "Physical Verifications"
- Complete identity document verification
- Prove your real-world identity
- Earn additional Human Score points

### 5. **Track Your Human Score**
- Monitor your cumulative verification status
- View earned points and trust levels
- See detailed breakdowns of all verifications
- Watch your portable identity grow

## 🔒 Security Features

- **OAuth 2.0**: Secure social media authentication
- **Wallet Integration**: Non-custodial wallet connections
- **Environment Variables**: Secure API key management
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Client and server-side validation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```bash
docker build -t veridion-dashboard .
docker run -p 3000:3000 veridion-dashboard
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Stellar Development Foundation](https://stellar.org/) for blockchain infrastructure
- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for deployment platform
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/veridion-dashboard/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/veridion-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/veridion-dashboard/discussions)

## 👨🏻‍💻 Meet the Team

- **Pablo Mora** – Web3 Product Strategist
- **Santiago Villarreal** – Blockchain Engineer  
- **Fabián Sánchez** – Fullstack Developer

## 🔮 Roadmap

- [ ] **API/SDK for Businesses**: Plug-in compliance in minutes
- [ ] **On-Chain Reputation**: Portable trust scores for lending
- [ ] **Advanced Analytics**: Detailed verification insights
- [ ] **Mobile App**: React Native companion app
- [ ] **Multi-chain Support**: Ethereum, Polygon, Solana
- [ ] **NFT Verification**: NFT ownership verification
- [ ] **DAO Governance**: Community-driven features
- [ ] **Enterprise Integration**: White-label solutions

---

<div align="center">

**Veridion makes Stellar safer, more inclusive, and human-first. 🚀**

**Built with ❤️ during HackMeridian 2025**

[⭐ Star this repo](https://github.com/yourusername/veridion-dashboard) | [🐛 Report Bug](https://github.com/yourusername/veridion-dashboard/issues) | [💡 Request Feature](https://github.com/yourusername/veridion-dashboard/issues)

</div>