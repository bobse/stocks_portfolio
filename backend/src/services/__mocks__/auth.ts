import express, { Application } from "express";

const setupGCPAuth = (app: Application) => {
   console.log("Mock auth activated!");
};

function checkLoggedIn(
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) {
   req.user = "testuser@test.com";
   next();
}

export { setupGCPAuth, checkLoggedIn };
