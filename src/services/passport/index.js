import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtSecret, masterKey } from "../../config";
import * as googleService from "../google";
import User from "../../api/user/model";

export const password = () => (req, res, next) =>
  passport.authenticate("password", { session: false }, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).jsonp({
        code: 400,
        message: "request parameter is invalid",
      });
    } else if (err || !user) {
      return res.status(400).jsonp({
        code: 400,
        message: "Username or password is invalid",
      });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end();
      next();
    });
    return null;
  })(req, res, next);

export const google = () => passport.authenticate("google", { session: false });

export const master = () => passport.authenticate("master", { session: false });

export const token =
  ({ required, roles = User.roles } = {}) =>
  (req, res, next) =>
    passport.authenticate("token", { session: false }, (err, user, info) => {
      if (
        err ||
        (required && !user) ||
        (required && !~roles.indexOf(user.role))
      ) {
        return res.status(401).end();
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) return res.status(401).end();
        next();
      });
    })(req, res, next);

passport.use(
  "facebook",
  new BearerStrategy((token, done) => {
    facebookService
      .getUser(token)
      .then((user) => {
        return User.createFromService(user);
      })
      .then((user) => {
        done(null, user);
        return null;
      })
      .catch(done);
  })
);

passport.use(
  "github",
  new BearerStrategy((token, done) => {
    githubService
      .getUser(token)
      .then((user) => {
        return User.createFromService(user);
      })
      .then((user) => {
        done(null, user);
        return null;
      })
      .catch(done);
  })
);

passport.use(
  "google",
  new BearerStrategy((token, done) => {
    googleService
      .getUser(token)
      .then((user) => {
        return User.createFromService(user);
      })
      .then((user) => {
        done(null, user);
        return null;
      })
      .catch(done);
  })
);

passport.use(
  "master",
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  "token",
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("access_token"),
        ExtractJwt.fromBodyField("access_token"),
        ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      ]),
    },
    ({ id }, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user);
          return null;
        })
        .catch(done);
    }
  )
);
