import express, { Application } from "express";
import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import cookieSession from "cookie-session";

const setupGCPAuth = (app: Application) => {
   const redirect_url = process.env.FRONTEND || "";

   const GoogleStrategy = Strategy;
   passport.use(
      new GoogleStrategy(
         {
            clientID: process.env.GCP_OAUTH_ID || "",
            clientSecret: process.env.GCP_OAUTH_SECRET || "",
            callbackURL: "/auth/google/callback",
         },
         verifyCallback as any
      )
   );

   function verifyCallback(
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (err: any, id?: unknown) => void
   ) {
      console.log("Google email:", profile?._json.email);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //    return cb(err, user);
      // });
      done(null, profile?._json.email);
   }

   // Save the session to the cookie
   passport.serializeUser(
      (user: false | Express.User | null | undefined, done) => {
         done(null, user);
      }
   );

   // Read the session from the cookie
   passport.deserializeUser(
      (user: false | Express.User | null | undefined, done) => {
         // User.findById(id).then(user => {
         //   done(null, user);
         // });
         done(null, user);
      }
   );

   const COOKIE_KEY = process.env.COOKIE_KEY;
   if (COOKIE_KEY === undefined) {
      throw new Error("Cookie key must be set in env variables");
   }

   app.use(
      cookieSession({
         name: "session",
         // 3 days
         maxAge: 3 * 24 * 60 * 60 * 1000,
         keys: [COOKIE_KEY],
         sameSite: "lax",
      })
   );
   // register regenerate & save after the cookieSession middleware initialization
   //   FIX Passport renegerate issue: https://github.com/jaredhanson/passport/issues/904
   app.use(function (request, response, next) {
      if (request.session && !request.session.regenerate) {
         request.session.regenerate = (cb: any) => {
            cb();
         };
      }
      if (request.session && !request.session.save) {
         request.session.save = (cb: any) => {
            cb();
         };
      }
      next();
   });
   app.use(passport.initialize());
   app.use(passport.session());

   app.get(
      "/auth/google",
      passport.authenticate("google", {
         scope: ["email", "profile"],
      })
   );

   app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
         failureRedirect: `${redirect_url}/login`,
         session: true,
      }),
      (req: express.Request, res: express.Response) => {
         res.redirect(redirect_url + "/");
      }
   );

   app.post("/auth/logout", function (req, res, next) {
      req.logout(function (err) {
         if (err) {
            return next(err);
         }
         res.status(200).end();
      });
   });
};

function checkLoggedIn(
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) {
   const isLoggedIn = req.isAuthenticated() && req.user;
   if (!isLoggedIn) {
      return res.status(401).json({
         error: "You must log in!",
      });
   }
   next();
}

export { setupGCPAuth, checkLoggedIn };
