export const isRecommended = (product, averagePrice) => {
  return product.rating.rate > 4 || product.price < averagePrice;
};
