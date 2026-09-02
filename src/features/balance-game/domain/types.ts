export type BalanceGameWeight = 'light' | 'deep';
export type BalanceGameCategory = 'daily' | 'faith';

export function isBalanceGameWeight(value: unknown): value is BalanceGameWeight {
  return value === 'light' || value === 'deep';
}

export type BalanceGameQuestion = {
  id: string;
  weight: BalanceGameWeight;
  category: BalanceGameCategory;
  topic?: string;
  prompt: string;
  context?: string;
  left: string;
  right: string;
};
