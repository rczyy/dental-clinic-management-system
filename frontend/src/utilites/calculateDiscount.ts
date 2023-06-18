export const calculateDiscount = (price: number, discountPercentage: number) => {
  return price - price * (discountPercentage / 100);
};
