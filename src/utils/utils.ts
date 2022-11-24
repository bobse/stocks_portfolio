function setNumDecimals(num: number): number {
  return +(Math.round(num * 100) / 100).toFixed(2);
}

function getPagination(limit: any, page: any) {
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

function parseErrorsResponse(err: any, defaultMessage: string) {
  if (
    err._message &&
    err._message.toUpperCase().includes("VALIDATION FAILED") &&
    err.errors
  ) {
    const errors = parseErrorValidationMessages(err);
    return { error: errors };
  }
  if (err.message) {
    return { error: err.message };
  }
  return { error: defaultMessage };
}

function parseErrorValidationMessages(err: any) {
  const response = new Map<string, string>();
  Object.keys(err.errors).forEach((key) => {
    if (err.errors[key].name === "CastError") {
      // CastErrors occur before validation errors and their message is confusing. So we replace the message.
      response.set(key, `Invalid ${key}`);
    } else {
      response.set(key, err.errors[key].message);
    }
  });
  return Object.fromEntries(response);
}

function yearParamConvert(year: string | "all"): number | undefined {
  if (year === "all" || isNaN(+year)) {
    return undefined;
  }
  return +year;
}

export { setNumDecimals, getPagination, parseErrorsResponse, yearParamConvert };
