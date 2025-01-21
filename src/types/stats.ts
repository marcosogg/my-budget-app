export interface TransactionStat {
  amount: number;
  count: number;
}

export interface TransactionStats {
  cardPayments: TransactionStat;
  savingsTotal: TransactionStat;
  creditCardRepayments: TransactionStat;
}