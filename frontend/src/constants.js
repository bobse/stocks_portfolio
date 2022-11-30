let HOST = "";
if (process.env.NODE_ENV === "production") {
   const PORT = process.env.PORT || "5000";
   HOST = `http://localhost:${PORT}`;
} else {
   HOST = "http://192.168.15.10:5000";
}

export const APIHOST = `${HOST}/api/v1`;
export const APIPORTFOLIO = `${APIHOST}/portfolio`;
export const APITRADES = `${APIHOST}/trades`;
export const APITOTALTRADES = `${APIHOST}/trades/totals`;
export const APIINCOMES = `${APIHOST}/incomes`;
export const APITOTALINCOMES = `${APIHOST}/incomes/totals`;
