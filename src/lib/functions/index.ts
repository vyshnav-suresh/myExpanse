import { Aggregates, expenseItem } from "../type";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const extractKeyValueSeperate = (data1: any) => {
  const categorySums = data1;
  const keys: any = (categorySums && Object.keys(categorySums)) ?? []; // Array of keys
  const values: any = (categorySums && Object.values(categorySums)) ?? [];
  return { keys, values };
};

export function updateCategories(
  data: expenseItem[],

  keywords: { [key: string]: string }
): expenseItem[] {
  return data.map((item) => {
    for (const [key, value] of Object.entries(keywords)) {
      if (item.description.includes(key)) {
        item.category = value;
        break; // Once a match is found, break the loop to prevent further updates.
      }
    }
    return item;
  });
}

export const getDegreeFromValue = (value: number, maxValue: number) => {
  const maxDegrees = 180;
  return (value / maxValue) * maxDegrees;
};

export const calculateCategoryAggregates = (
  transactions: expenseItem[]
): Aggregates => {
  return transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (acc[category]) {
      acc[category] += amount;
    } else {
      acc[category] = amount;
    }
    return acc;
  }, {} as Aggregates);
};
