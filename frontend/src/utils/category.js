export const getCategoryId = (category) => {
  if (!category) return '';
  return category.id || category._id?.toString?.() || category._id || '';
};
