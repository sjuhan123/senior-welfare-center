const zIndex = {
  toast: 2000,
  modal: 1000,
  dropdown: 500,
  aboveDefault: 1,
  default: 0,
  belowDefault: -1,
  above: (n: number) => n + 1,
  below: (n: number) => n - 1,
};

export default zIndex;
