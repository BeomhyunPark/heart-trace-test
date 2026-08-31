export type BalanceGameWeight = 'light' | 'deep';
export type BalanceGameCategory = 'daily' | 'faith';

export type BalanceGameQuestion = {
  id: string;
  weight: BalanceGameWeight;
  category: BalanceGameCategory;
  prompt: string;
  left: string;
  right: string;
};
