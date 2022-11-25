function validatePagination(limit: any, page: any) {
  return {
    limit: limit !== undefined ? queryParamToNumber(limit) : undefined,
    page: page !== undefined ? queryParamToNumber(page) : undefined,
  };
}

function queryParamToNumber(param: Array<any> | any): number {
  if (param instanceof Array) param = param[0];
  param = +param;
  if (isNaN(param) || param <= 0) {
    throw new Error(`${param} must be a valid number and bigger than 0`);
  }
  return param;
}

function yearParamConvert(year: string | "all"): number | undefined {
  if (year === "all" || isNaN(+year)) {
    return undefined;
  }
  return +year;
}

export { validatePagination, yearParamConvert };
