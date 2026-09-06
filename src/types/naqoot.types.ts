export interface NaqootEntryInput {
  donorName: string;
  amount: number;
  message?: string;
}

export interface NaqootLeaderboardEntry {
  donorName: string;
  totalAmount: number;
  entriesCount: number;
}
