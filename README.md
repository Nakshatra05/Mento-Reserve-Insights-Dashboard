# Mento Reserve Insights Dashboard

A public dashboard for the Celo Foundation Data & Ecosystem Insights Intern assignment. This dashboard visualizes Mento's reserve holdings across the Celo and Ethereum blockchains, providing clear insights into the composition and distribution of assets backing Mento stablecoins.

## 🎯 Project Overview

Mento is a core protocol in the Celo ecosystem focused on building decentralized, overcollateralized stablecoins for real-world use cases. This dashboard was created as part of the Celo Foundation Data & Ecosystem Insights Intern assignment to help the Celo community and Mento team better understand how stablecoins are backed by on-chain reserves.

## 📝 Assignment Context

This dashboard is a deliverable for the Celo Foundation's Data & Ecosystem Insights Intern role. The objectives are:
- Break down reserve holdings by asset (e.g., CELO, sDAI, ETH, BTC, stEUR, USDC, etc.)
- Segment reserve assets by chain (Celo and Ethereum)
- Show the aggregated USD value of reserves on each chain and in total
- Bonus: Further segment reserve holdings by protocol (e.g., Uniswap, Aave)

For more details, see the [assignment background](https://reserve.mento.org/) and [reserve addresses](https://github.com/mento-protocol/mento-analytics-api/blob/main/src/api/reserve/config/addresses.config.ts).

## ✨ Features

### Core Visualizations
- **Total Reserve Value**: Real-time USD value of all reserve assets
- **Chain Distribution**: Breakdown of assets across Celo and Ethereum
- **Asset Breakdown**: Distribution by asset type, segmented by chain
- **Protocol Exposure**: Assets held in DeFi protocols (Aave, Uniswap V3)

### Key Metrics
- Reserve value by blockchain (Celo vs Ethereum)
- Asset composition and percentages
- Protocol-level segmentation

### Supported Assets
- **Stablecoins**: USDC, USDT, EURC, USDGLO, stEUR, cUSD, cEUR, cREAL, eXOF, cKES
- **Cryptocurrencies**: CELO, ETH, BTC, sDAI, stETH

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nakshatra05/Mento-Reserve-Insights-Dashboard.git
cd Mento-Reserve-Insights-Dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

- **Data Source:** Zapper API (for reserve, protocol, and asset data)
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Charts:** Recharts

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── OverviewCards.tsx  # Key metrics cards
│   ├── AssetBreakdown.tsx # Asset distribution chart
│   ├── ChainComparison.tsx # Chain comparison
│   ├── ProtocolBreakdown.tsx # Protocol exposure
│   └── LoadingSpinner.tsx # Loading component
├── services/              # Data services
│   └── zapper.ts          # Reserve data fetching
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
├── config/                # Configuration files
│   └── addresses.ts       # Reserve addresses
└── public/                # Static assets
```

## 📊 Data Sources

- **Zapper API:** Used for all reserve, asset, and protocol data
- **Celo/Ethereum Addresses:** Queried via Zapper

### Reserve Addresses
The dashboard tracks assets across multiple reserve addresses:
- **Main Reserve Contract**: `0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9`
- **Operational Accounts**: Multiple addresses for rebalancing
- **Protocol Positions**: Aave and Uniswap V3 positions

## 🎨 Design System

### Color Palette
- **Celo Primary**: #35D07F (Green)
- **Ethereum Primary**: #627EEA (Blue)
- **Neutral**: Gray scale for UI elements

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for production configuration:

```env
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key
```

### Customization
- Modify `config/addresses.ts` to add/remove reserve addresses
- Update `services/zapper.ts` to integrate with real APIs
- Customize charts in individual components

## 📈 Future Enhancements

### Planned Features
- Real-time blockchain data integration
- Historical data and trends
- Alert system for significant changes
- Mobile-responsive design improvements
- Export functionality for reports

### API Integration
- Implement WebSocket connections for live updates
- Add caching layer for performance
- Integrate with Mento's analytics API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Mento Protocol team for the reserve address configuration
- Celo Foundation for the ecosystem support
- Open source community for the amazing tools and libraries

---

**Note**: This dashboard was created as part of the application for the Data & Ecosystem Insights Intern position at Celo Foundation. The current implementation may use mock data to demonstrate visualization and design approach, and is not intended for production use. 