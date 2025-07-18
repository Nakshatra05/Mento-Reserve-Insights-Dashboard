export function formatBalance(balance: string | number, decimals: number = 18, precision: number = 4): string {
  const value = typeof balance === 'string' ? parseFloat(balance) : balance;
  return (value / Math.pow(10, decimals)).toFixed(precision);
}

export function shortenAddress(address: string, chars: number = 4): string {
  return address ? `${address.slice(0, chars + 2)}...${address.slice(-chars)}` : '';
} 