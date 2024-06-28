function convertCategorySum(categorySum: { [key: string]: number }): {
  keys: string[];
  values: number[];
} {
  const keys: string[] = Object.keys(categorySum);
  const values: number[] = Object.values(categorySum);
  return { keys, values };
}
