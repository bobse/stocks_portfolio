import { ValidationError } from "class-validator";

function setNumDecimals(num: number): number {
  return +(Math.round(num * 100) / 100).toFixed(2);
}

function parseErrorsResponse(err: any, defaultMessage: string) {
  if (err instanceof Array && err[0] instanceof ValidationError) {
    const errors = parseErrorDTOValidation(err);
    return { error: errors };
  }
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

function parseErrorDTOValidation(err: ValidationError[]) {
  const e: { [key: string]: string | string[] } = {};
  err.forEach((elem) => {
    if (elem.constraints !== undefined) {
      Object.assign(e, { [elem.property]: Object.values(elem.constraints) });
    } else {
      Object.assign(e, { [elem.property]: `Invalid ${elem.property}` });
    }
  });
  return e;
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

export { setNumDecimals, parseErrorsResponse };
