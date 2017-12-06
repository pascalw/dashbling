module.exports.mockDate = timestamp => {
  const originalNow = Date.now;
  const mockedDateFn = () => timestamp;
  mockedDateFn.restore = () => (Date.now = originalNow);

  Date.now = mockedDateFn;
};
