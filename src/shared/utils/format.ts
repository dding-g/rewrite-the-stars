export const starCountFormat = (startCount: number) => {
  if (startCount < 1000) {
    return startCount;
  }
  return `${Math.floor(startCount / 1000)}k`;
};
