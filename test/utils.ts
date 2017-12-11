export const mockDate = (date: Date) => {
  const originalNow = Date.now;
  const mockedDateFn = () => date.getTime();
  (mockedDateFn as any).restore = () => (Date.now = originalNow);

  Date.now = mockedDateFn;
};

export const restoreDate = () => {
  (Date.now as any).restore();
};
