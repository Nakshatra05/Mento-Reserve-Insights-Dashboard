export enum Chain {
  CELO = 'CELO',
  ETHEREUM = 'ETHEREUM'
}

export enum AddressCategory {
  MENTO_RESERVE = 'MENTO_RESERVE',
  UNIV3_POOL = 'UNIV3_POOL',
  AAVE = 'AAVE'
}

export interface ReserveAddressConfig {
  address: string;
  chain: Chain;
  category: AddressCategory;
  label: string;
  assets: string[];
  description: string;
}

export interface AssetBalance {
  symbol: string;
  balance: string;
  decimals: number;
  usdValue: number;
  chain: Chain;
  protocol?: string;
}

export interface ReserveData {
  totalUsdValue: number;
  celoUsdValue: number;
  ethereumUsdValue: number;
  assets: AssetBalance[];
  lastUpdated: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface ProtocolData {
  protocol: string;
  usdValue: number;
  assets: AssetBalance[];
} 