import express from "express";

function logger(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const currDate = new Date();
  const method = req.method;
  const url = req.url;
  const startTime = process.hrtime();
  res.on("finish", () => {
    const totalTime = process.hrtime(startTime);
    const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
    const status = res.statusCode;
    const log = `${currDate.toISOString()} | ${status} | ${totalTimeInMs.toFixed(
      2
    )}ms  > ${method} > ${url}`;
    status >= 300 ? console.warn(log) : console.log(log);
  });
  next();
}

export { logger };
