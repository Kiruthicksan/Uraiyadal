export const useUpperCase = (data: string) => {
  return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
};
