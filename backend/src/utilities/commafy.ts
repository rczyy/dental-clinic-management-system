export const commafy = (text: string) => {
  return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
