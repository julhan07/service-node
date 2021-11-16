import { sign } from "../../services/jwt";
import {
  success,
  responseError,
  responseUnauthorized,
  responseSuccess,
} from "../../services/response/";
import { User } from "./";

export const login = ({ user }, res, next) =>
  sign(user.id)
    .then((token) => ({ token, user: user.view(true) }))
    .then(success(res, 201))
    .catch(next);

export const basicLogin = (
  {
    bodymen: {
      body: { email, password },
    },
  },
  res,
  next
) => {
  User.findOne({ email: email })
    .then((data) => {
      if (!data) {
        return responseUnauthorized(res, "Username atau password salah");
      }
      sign(data.id)
        .then((token) => {
          let userLogin = {
            token: token,
            user: data.view(true),
          };
          return responseSuccess(res, "Sucess", userLogin);
        })
        .catch((e) => {
          return responseError(res, e.message);
        });
    })
    .catch((e) => {
      return responseError(e.message);
    });
};
