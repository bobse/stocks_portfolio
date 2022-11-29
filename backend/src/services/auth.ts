import express from "express";

function checkLoggedIn(
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) {
   req.user = {
      name: "Roberto Seba",
      id: "xyz",
      lastLogin: new Date(),
      email: "roberto@robertoseba.com",
   };
   //   const isLoggedIn = req.isAuthenticated() && req.user;
   //   if (!isLoggedIn) {
   //     return res.status(401).json({
   //       error: "You must log in!",
   //     });
   //   }
   console.log(`User Logged in: ${req.user.email}`);
   next();
}

export { checkLoggedIn };
