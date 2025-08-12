export const generateOrderNumber = (): string => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORDER-${datePart}-${randomPart}`;
};
