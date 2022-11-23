function setNumDecimals(num: number): number {
  return +(Math.round(num * 100) / 100).toFixed(2);
}

export { setNumDecimals };
