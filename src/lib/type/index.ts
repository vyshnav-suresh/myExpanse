export type keyword_category_mapping_Type = {
  bakery: string;
  restaurant: string;
  insurance: string;
  gift: string;
  salon: string;
  phone: string;
  renewal: string;
  clothing: string;
  electricity: string;
};

export interface ExcelRow {
  [key: string]: any;
}

export interface expenseItem {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface Aggregates {
  [key: string]: number;
}
