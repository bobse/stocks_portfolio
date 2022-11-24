import express from "express";

function checkLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  Object.assign(req, { user: "roberto@robertoseba.com" });
  //   const isLoggedIn = req.isAuthenticated() && req.user;
  //   if (!isLoggedIn) {
  //     return res.status(401).json({
  //       error: "You must log in!",
  //     });
  //   }
  next();
}

export { checkLoggedIn };
