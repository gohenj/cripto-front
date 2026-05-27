export interface Wallet {
  token: 'BRL' | 'BTC' | 'ETH';
  balance: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'SWAP_IN' | 'SWAP_OUT' | 'SWAP_FEE' | 'WITHDRAWAL';
  amount: string;
  createdAt: string;
}