import fetch from 'node-fetch';

// Zapper API Configuration
const ZAPPER_API_BASE = 'https://public.zapper.xyz';
const ZAPPER_API_KEY = process.env.NEXT_PUBLIC_ZAPPER_API_KEY;
if (!ZAPPER_API_KEY) {
  throw new Error('Zapper API key is missing. Please set NEXT_PUBLIC_ZAPPER_API_KEY in your .env file.');
}

// Reserve addresses for Mento
const RESERVE_ADDRESSES = {
  ethereum: '0xd0697f70E79476195B742d5aFAb14BE50f98CC1E',
  celo: '0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9'
};

// Chain IDs for Zapper
const CHAIN_IDS = {
  ethereum: 1,
  celo: 42220
};

// TypeScript interfaces for Zapper API responses
interface Network {
  name: string;
  chainId: number;
}

interface TokenNode {
  symbol: string;
  tokenAddress: string;
  balance: number;
  balanceUSD: number;
  price: number;
  name: string;
  decimals: number;
  network: Network;
}

interface TokenEdge {
  node: TokenNode;
}

interface TokenBalances {
  totalBalanceUSD: number;
  byToken: {
    totalCount: number;
    edges: TokenEdge[];
  };
  byNetwork: {
    edges: Array<{
      node: {
        network: Network;
        balanceUSD: number;
      };
    }>;
  };
}

interface App {
  displayName: string;
  slug: string;
  description?: string;
  category?: {
    name: string;
  };
  url?: string;
}

interface AppPositionToken {
  type: string;
  address: string;
  network: string;
  balance: number;
  balanceUSD: number;
  price: number;
  symbol: string;
  decimals: number;
  appId?: string;
  tokens?: AppPositionToken[];
}

interface AppTokenPositionBalance {
  type: string;
  address: string;
  network: string;
  symbol: string;
  decimals: number;
  balance: number;
  balanceUSD: number;
  price: number;
  appId: string;
  groupId: string;
  groupLabel: string;
  supply: number;
  pricePerShare: number;
  tokens: AppPositionToken[];
  displayProps: {
    label: string;
    images: string[];
  };
}

interface ContractPositionToken {
  metaType: string;
  token: AppPositionToken;
}

interface ContractPositionBalance {
  type: string;
  address: string;
  network: string;
  appId: string;
  groupId: string;
  groupLabel: string;
  balanceUSD: number;
  tokens: ContractPositionToken[];
  displayProps: {
    label: string;
    images: string[];
  };
}

interface PositionEdge {
  node: AppTokenPositionBalance | ContractPositionBalance;
}

interface AppEdge {
  node: {
    balanceUSD: number;
    app: App;
    network: Network;
    positionBalances: {
      edges: PositionEdge[];
    };
  };
}

interface AppBalances {
  totalBalanceUSD: number;
  byApp: {
    totalCount: number;
    edges: AppEdge[];
  };
  byMetaType: {
    edges: Array<{
      node: {
        metaType: string;
        positionCount: number;
        balanceUSD: number;
      };
    }>;
  };
  byNetwork: {
    edges: Array<{
      node: {
        network: Network;
        balanceUSD: number;
      };
    }>;
  };
}

interface NFTBalances {
  totalBalanceUSD: number;
  totalTokensOwned: number;
  byNetwork: {
    edges: Array<{
      node: {
        network: Network;
        balanceUSD: number;
      };
    }>;
  };
}

interface PortfolioV2 {
  tokenBalances: TokenBalances;
  appBalances: AppBalances;
  nftBalances: NFTBalances;
}

interface PortfolioData {
  portfolioV2: PortfolioV2;
}

// Custom type for extracted tokens with metaType and level
interface ExtractedToken {
  symbol: string;
  name?: string;
  balance: number;
  balanceUSD: number;
  price: number;
  address: string;
  network: string;
  appId?: string;
  metaType?: string;
  level?: number;
  protocol?: string;
  category?: string;
}

class ZapperAPI {
  apiKey: string;
  baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = ZAPPER_API_BASE;
  }

  async makeGraphQLRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zapper-api-key': this.apiKey
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Zapper API error: ${response.status} - ${response.statusText}\nResponse: ${errorText}`);
      }

      const data = await response.json() as { errors?: any; [key: string]: any };
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }
      return data.data;
    } catch (error: any) {
      console.error(`Failed to fetch from Zapper API:`, error?.message || error);
      return null;
    }
  }

  async getCompletePortfolio(addresses: string[], chainIds: number[] | null = null): Promise<PortfolioData | null> {
    const query = `
      query CompletePortfolio($addresses: [Address!]!, $chainIds: [Int!]) {
        portfolioV2(addresses: $addresses, chainIds: $chainIds) {
          tokenBalances {
            totalBalanceUSD
            byToken(first: 100, filters: { minBalanceUSD: 1 }) {
              totalCount
              edges {
                node {
                  symbol
                  tokenAddress
                  balance
                  balanceUSD
                  price
                  name
                  decimals
                  network {
                    name
                    chainId
                  }
                }
              }
            }
            byNetwork(first: 20) {
              edges {
                node {
                  network {
                    name
                    chainId
                  }
                  balanceUSD
                }
              }
            }
          }
          appBalances {
            totalBalanceUSD
            byApp(first: 50) {
              totalCount
              edges {
                node {
                  balanceUSD
                  app {
                    displayName
                    slug
                    description
                    category {
                      name
                    }
                    url
                  }
                  network {
                    name
                    chainId
                  }
                  positionBalances(first: 20) {
                    edges {
                      node {
                        ... on AppTokenPositionBalance {
                          type
                          address
                          network
                          symbol
                          decimals
                          balance
                          balanceUSD
                          price
                          appId
                          groupId
                          groupLabel
                          supply
                          pricePerShare
                          tokens {
                            ... on BaseTokenPositionBalance {
                              type
                              address
                              network
                              balance
                              balanceUSD
                              price
                              symbol
                              decimals
                            }
                            ... on AppTokenPositionBalance {
                              type
                              address
                              network
                              balance
                              balanceUSD
                              price
                              symbol
                              decimals
                              appId
                              tokens {
                                ... on BaseTokenPositionBalance {
                                  type
                                  address
                                  network
                                  balance
                                  balanceUSD
                                  price
                                  symbol
                                  decimals
                                }
                              }
                            }
                          }
                          displayProps {
                            label
                            images
                          }
                        }
                        ... on ContractPositionBalance {
                          type
                          address
                          network
                          appId
                          groupId
                          groupLabel
                          balanceUSD
                          tokens {
                            metaType
                            token {
                              ... on BaseTokenPositionBalance {
                                type
                                address
                                network
                                balance
                                balanceUSD
                                price
                                symbol
                                decimals
                              }
                              ... on AppTokenPositionBalance {
                                type
                                address
                                network
                                balance
                                balanceUSD
                                price
                                symbol
                                decimals
                                appId
                                tokens {
                                  ... on BaseTokenPositionBalance {
                                    type
                                    address
                                    network
                                    balance
                                    balanceUSD
                                    price
                                    symbol
                                    decimals
                                  }
                                }
                              }
                            }
                          }
                          displayProps {
                            label
                            images
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            byMetaType(first: 10) {
              edges {
                node {
                  metaType
                  positionCount
                  balanceUSD
                }
              }
            }
            byNetwork(first: 20) {
              edges {
                node {
                  network {
                    name
                    chainId
                  }
                  balanceUSD
                }
              }
            }
          }
          nftBalances {
            totalBalanceUSD
            totalTokensOwned
            byNetwork(first: 10) {
              edges {
                node {
                  network {
                    name
                    chainId
                  }
                  balanceUSD
                }
              }
            }
          }
        }
      }
    `;
    return await this.makeGraphQLRequest(query, { addresses, chainIds });
  }
}

function formatBalance(balance: number | string, decimals: number = 18): string {
  if (!balance) return '0';
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
}

function categorizeProtocol(appSlug: string, category: string): string {
  const slug = appSlug?.toLowerCase() || '';
  const cat = category?.toLowerCase() || '';
  
  // Specific protocol categorization
  if (slug.includes('spark') || slug.includes('sdai')) return 'Savings (Spark/sDAI)';
  if (slug.includes('aave')) return 'Lending (Aave)';
  if (slug.includes('compound')) return 'Lending (Compound)';
  if (slug.includes('maker') || slug.includes('makerdao')) return 'Savings (MakerDAO)';
  if (slug.includes('uniswap')) return 'DEX (Uniswap)';
  if (slug.includes('sushiswap')) return 'DEX (SushiSwap)';
  if (slug.includes('curve')) return 'DEX (Curve)';
  if (slug.includes('balancer')) return 'DEX (Balancer)';
  if (slug.includes('lido')) return 'Liquid Staking (Lido)';
  if (slug.includes('rocket') || slug.includes('reth')) return 'Liquid Staking (Rocket Pool)';
  if (slug.includes('mento')) return 'Mento Protocol';
  if (slug.includes('ubeswap')) return 'DEX (Ubeswap)';
  if (slug.includes('moola')) return 'Lending (Moola)';
  
  // Category-based fallback
  if (cat.includes('dex') || cat.includes('exchange')) return 'DEX/AMM';
  if (cat.includes('lending')) return 'Lending';
  if (cat.includes('staking')) return 'Staking';
  if (cat.includes('yield')) return 'Yield Farming';
  if (cat.includes('savings')) return 'Savings';
  
  return 'Other Protocol';
}

function extractUnderlyingTokens(tokens: AppPositionToken[], level: number = 0): ExtractedToken[] {
  const result: ExtractedToken[] = [];
  if (!tokens || level > 3) return result;

  tokens.forEach(token => {
    if (token.type === 'base-token') {
      result.push({
        symbol: token.symbol,
        balance: token.balance,
        balanceUSD: token.balanceUSD,
        price: token.price,
        address: token.address,
        network: token.network,
        level: level
      });
    } else if (token.type === 'app-token' && token.tokens) {
      result.push({
        symbol: token.symbol,
        balance: token.balance,
        balanceUSD: token.balanceUSD,
        price: token.price,
        address: token.address,
        network: token.network,
        appId: token.appId,
        level: level
      });
      result.push(...extractUnderlyingTokens(token.tokens, level + 1));
    }
  });

  return result;
}

function extractContractTokens(tokens: ContractPositionToken[]): ExtractedToken[] {
  const result: ExtractedToken[] = [];
  if (!tokens) return result;

  tokens.forEach(tokenWithMeta => {
    const token = tokenWithMeta.token;
    const metaType = tokenWithMeta.metaType;

    if (token.type === 'base-token') {
      result.push({
        symbol: token.symbol,
        balance: token.balance,
        balanceUSD: token.balanceUSD,
        price: token.price,
        address: token.address,
        network: token.network,
        metaType: metaType
      });
    } else if (token.type === 'app-token') {
      result.push({
        symbol: token.symbol,
        balance: token.balance,
        balanceUSD: token.balanceUSD,
        price: token.price,
        address: token.address,
        network: token.network,
        appId: token.appId,
        metaType: metaType
      });
      if (token.tokens) {
        result.push(...extractUnderlyingTokens(token.tokens, 1));
      }
    }
  });

  return result;
}

// Add types for results object in analyzeReservePortfolio
interface ProtocolInfo {
  name: string;
  slug: string;
  category: string;
  network: string;
  chainId: number;
  totalValue: number;
  positions: Array<{
    type: string;
    label: string;
    balanceUSD: number;
    underlyingTokens?: ExtractedToken[];
    tokens?: ExtractedToken[];
  }>;
}

interface Claimable {
  protocol: string;
  symbol: string;
  balance: number;
  balanceUSD: number;
  network: string;
}

async function analyzeReservePortfolio() {
  console.log('🚀 Starting Zapper-Powered Mento Reserve Analysis...');
  console.log('🔑 Using Zapper API with correct configuration');
  console.log('🌐 Endpoint: https://public.zapper.xyz/graphql');
  console.log('🔑 Auth: x-zapper-api-key header\n');

  const zapperApi = new ZapperAPI(ZAPPER_API_KEY as string);
  const addresses = Object.values(RESERVE_ADDRESSES);
  const chainIds = Object.values(CHAIN_IDS);

  console.log('📊 Fetching complete portfolio data...');
  console.log(`🏦 Addresses: ${addresses.join(', ')}`);
  console.log(`🔗 Chains: ${chainIds.join(', ')} (1=Ethereum, 42220=Celo)\n`);

  // Test connection first
  console.log('🔍 Testing Zapper API connection...');
  const testQuery = `
    query TestConnection($addresses: [Address!]!) {
      portfolioV2(addresses: $addresses) {
        tokenBalances {
          totalBalanceUSD
        }
      }
    }
  `;
  
  const testResult = await zapperApi.makeGraphQLRequest(testQuery, { addresses: [addresses[0]] });
  if (!testResult) {
    throw new Error('Failed to connect to Zapper API');
  }
  console.log('✅ Zapper API connection successful!\n');

  try {
    const portfolioData = await zapperApi.getCompletePortfolio(addresses, chainIds);
    
    if (!portfolioData) {
      throw new Error('Failed to fetch portfolio data from Zapper');
    }

    const results: {
      summary: {
        totalTokens: number;
        totalApps: number;
        totalNFTs: number;
        grandTotal: number;
      };
      tokens: ExtractedToken[];
      protocols: ProtocolInfo[];
      categories: Record<string, {
        totalValue: number;
        protocols: string[];
        networks: Set<string>;
      }>;
      metaTypes: Record<string, { positionCount: number; balanceUSD: number }>;
      networks: Record<string, any>;
      claimables: Claimable[];
    } = {
      summary: {
        totalTokens: portfolioData.portfolioV2.tokenBalances.totalBalanceUSD,
        totalApps: portfolioData.portfolioV2.appBalances.totalBalanceUSD,
        totalNFTs: portfolioData.portfolioV2.nftBalances.totalBalanceUSD,
        grandTotal: 0
      },
      tokens: [],
      protocols: [],
      categories: {},
      metaTypes: {},
      networks: {},
      claimables: []
    };

    results.summary.grandTotal = results.summary.totalTokens + results.summary.totalApps + results.summary.totalNFTs;

    console.log('='.repeat(80));
    console.log('📋 MENTO RESERVE PORTFOLIO SUMMARY');
    console.log('='.repeat(80));
    console.log(`💰 Total Portfolio Value: $${formatBalance(results.summary.grandTotal)}`);
    console.log(`📊 Token Balances: $${formatBalance(results.summary.totalTokens)}`);
    console.log(`🏛️ App Positions: $${formatBalance(results.summary.totalApps)}`);
    console.log(`🖼️ NFT Holdings: $${formatBalance(results.summary.totalNFTs)}`);

    // Process token balances (wallet holdings)
    console.log('\n' + '='.repeat(80));
    console.log('💰 WALLET TOKEN HOLDINGS');
    console.log('='.repeat(80));
    
    if (portfolioData.portfolioV2.tokenBalances.byToken?.edges) {
      portfolioData.portfolioV2.tokenBalances.byToken.edges.forEach(edge => {
        const token = edge.node;
        results.tokens.push({
          symbol: token.symbol,
          name: token.name,
          balance: token.balance,
          balanceUSD: token.balanceUSD,
          price: token.price,
          network: token.network.name,
          address: token.tokenAddress,
          protocol: 'Wallet Holdings',
          category: 'Wallet'
        });

        console.log(`  ${token.symbol}: ${formatBalance(token.balance)} = $${formatBalance(token.balanceUSD)} (${token.network.name})`);
      });
    }

    // Process app balances (DeFi protocol positions)
    console.log('\n' + '='.repeat(80));
    console.log('🏛️ DEFI PROTOCOL POSITIONS');
    console.log('='.repeat(80));
    
    if (portfolioData.portfolioV2.appBalances.byApp?.edges) {
      portfolioData.portfolioV2.appBalances.byApp.edges.forEach(appEdge => {
        const appData = appEdge.node;
        const app = appData.app;
        const network = appData.network;
        const protocolCategory = categorizeProtocol(app.slug, app.category?.name || '');

        console.log(`\n🏛️ ${app.displayName} (${network.name})`);
        console.log(`   💰 Total Value: $${formatBalance(appData.balanceUSD)}`);
        console.log(`   📂 Category: ${protocolCategory}`);
        console.log(`   🔗 URL: ${app.url || 'N/A'}`);

        const protocolInfo: ProtocolInfo = {
          name: app.displayName,
          slug: app.slug,
          category: protocolCategory,
          network: network.name,
          chainId: network.chainId,
          totalValue: appData.balanceUSD,
          positions: []
        };

        // Process positions within this app
        if (appData.positionBalances?.edges) {
          appData.positionBalances.edges.forEach(positionEdge => {
            const position = positionEdge.node;

            if (position.type === 'app-token') {
              console.log(`     📈 ${position.groupLabel || (position as AppTokenPositionBalance).symbol}: $${formatBalance(position.balanceUSD)}`);
              
              // Extract underlying tokens
              if (
                Array.isArray(position.tokens) &&
                position.tokens.length > 0 &&
                'symbol' in position.tokens[0]
              ) {
                const underlyingTokens = extractUnderlyingTokens(position.tokens as AppPositionToken[]);
                underlyingTokens.forEach(token => {
                  console.log(`       ${'  '.repeat(token.level || 0)}↳ ${token.symbol}: ${formatBalance(token.balance)} = $${formatBalance(token.balanceUSD)}`);
                });
                protocolInfo.positions.push({
                  type: 'app-token',
                  label: position.groupLabel || (position as AppTokenPositionBalance).symbol,
                  balanceUSD: position.balanceUSD,
                  underlyingTokens: underlyingTokens
                });
              }

            } else if (position.type === 'contract-position') {
              console.log(`     📋 ${position.displayProps?.label || 'Position'}: $${formatBalance(position.balanceUSD)}`);
              
              // Extract contract tokens with meta types
              if (
                Array.isArray(position.tokens) &&
                position.tokens.length > 0 &&
                'metaType' in position.tokens[0]
              ) {
                const contractTokens = extractContractTokens(position.tokens as ContractPositionToken[]);
                contractTokens.forEach(token => {
                  const metaLabel = token.metaType ? ` (${token.metaType})` : '';
                  console.log(`       ↳ ${token.symbol}: ${formatBalance(token.balance)} = $${formatBalance(token.balanceUSD)}${metaLabel}`);
                  
                  // Track claimables
                  if (token.metaType === 'CLAIMABLE') {
                    results.claimables.push({
                      protocol: app.displayName,
                      symbol: token.symbol,
                      balance: token.balance,
                      balanceUSD: token.balanceUSD,
                      network: network.name
                    });
                  }
                });
                protocolInfo.positions.push({
                  type: 'contract-position',
                  label: position.displayProps?.label || 'Position',
                  balanceUSD: position.balanceUSD,
                  tokens: contractTokens
                });
              }
            }
          });
        }

        results.protocols.push(protocolInfo);

        // Aggregate by category
        if (!results.categories[protocolCategory]) {
          results.categories[protocolCategory] = {
            totalValue: 0,
            protocols: [],
            networks: new Set()
          };
        }
        results.categories[protocolCategory].totalValue += appData.balanceUSD;
        results.categories[protocolCategory].protocols.push(app.displayName);
        results.categories[protocolCategory].networks.add(network.name);
      });
    }

    // Process meta types breakdown
    console.log('\n' + '='.repeat(80));
    console.log('📊 POSITION TYPES BREAKDOWN');
    console.log('='.repeat(80));
    
    if (portfolioData.portfolioV2.appBalances.byMetaType?.edges) {
      portfolioData.portfolioV2.appBalances.byMetaType.edges.forEach(edge => {
        const metaData = edge.node;
        results.metaTypes[metaData.metaType] = {
          positionCount: metaData.positionCount,
          balanceUSD: metaData.balanceUSD
        };
        
        const percentage = ((metaData.balanceUSD / results.summary.totalApps) * 100).toFixed(2);
        console.log(`  ${metaData.metaType}: ${metaData.positionCount} positions = $${formatBalance(metaData.balanceUSD)} (${percentage}%)`);
      });
    }

    // Show claimables summary
    if (results.claimables.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('🎁 CLAIMABLE REWARDS');
      console.log('='.repeat(80));
      
      let totalClaimable = 0;
      results.claimables.forEach(claimable => {
        totalClaimable += claimable.balanceUSD;
        console.log(`  ${claimable.protocol}: ${formatBalance(claimable.balance)} ${claimable.symbol} = $${formatBalance(claimable.balanceUSD)} (${claimable.network})`);
      });
      console.log(`\n  💰 Total Claimable Value: $${formatBalance(totalClaimable)}`);
    }

    // Generate category summary
    console.log('\n' + '='.repeat(80));
    console.log('📂 PROTOCOL CATEGORIES SUMMARY');
    console.log('='.repeat(80));
    
    const sortedCategories = Object.entries(results.categories)
      .sort(([,a], [,b]) => b.totalValue - a.totalValue);
    
    sortedCategories.forEach(([category, data], index) => {
      const percentage = ((data.totalValue / results.summary.totalApps) * 100).toFixed(2);
      const networks = Array.from(data.networks).join(', ');
      const protocols = [...new Set(data.protocols)].join(', ');
      
      console.log(`${index + 1}. 📂 ${category}`);
      console.log(`   💰 Value: $${formatBalance(data.totalValue)} (${percentage}%)`);
      console.log(`   🏛️ Protocols: ${protocols}`);
      console.log(`   🔗 Networks: ${networks}\n`);
    });

    // Export data
    console.log('\n' + '='.repeat(80));
    console.log('📁 DATA EXPORT');
    console.log('='.repeat(80));
    
    // CSV Export
    console.log('\n📊 CSV Export (Tokens):');
    console.log('Symbol,Name,Balance,USD_Value,Price,Network,Protocol,Category,Address');
    results.tokens.forEach(token => {
      console.log(`${token.symbol},${token.name},${token.balance},${token.balanceUSD},${token.price},${token.network},${token.protocol},${token.category},${token.address}`);
    });

    // JSON Summary
    console.log('\n🔗 JSON Summary:');
    const jsonSummary = {
      summary: results.summary,
      lastUpdated: new Date().toISOString(),
      protocolBreakdown: results.protocols.map(p => ({
        name: p.name,
        category: p.category,
        network: p.network,
        totalValue: p.totalValue,
        positionCount: p.positions.length
      })),
      categoryBreakdown: Object.entries(results.categories).map(([name, data]) => ({
        category: name,
        totalValue: data.totalValue,
        protocols: [...new Set(data.protocols)],
        networks: Array.from(data.networks)
      })),
      metaTypes: results.metaTypes,
      claimables: results.claimables
    };
    
    console.log(JSON.stringify(jsonSummary, null, 2));

    console.log('\n✅ Zapper analysis completed successfully!');
    console.log('📋 This shows exactly which DeFi protocols hold Mento reserves.');

    return results;

  } catch (error: any) {
    console.error('❌ Analysis failed:', error.message);
    throw error;
  }
}

// Run the script
if (typeof require !== 'undefined' && require.main === module) {
  analyzeReservePortfolio().catch(console.error);
}

export { analyzeReservePortfolio, ZapperAPI };