import { stub } from "sinon";
import request from "supertest";
import { apiRoot } from "../../config";
import { verify } from "../../services/jwt";
import * as google from "../../services/google";
import express from "../../services/express";
import routes from ".";

const app = () => express(apiRoot, routes);

test("POST /auth/google 201", async () => {
  stub(google, "getUser").value(() =>
    Promise.resolve({
      service: "google",
      id: "123",
      name: "user",
      email: "b@b.com",
      picture: "test.jpg",
    })
  );
  const { status, body } = await request(app())
    .post(apiRoot + "/google")
    .send({ access_token: "123" });
  expect(status).toBe(201);
  expect(typeof body).toBe("object");
  expect(typeof body.token).toBe("string");
  expect(typeof body.user).toBe("object");
  expect(await verify(body.token)).toBeTruthy();
});

test("POST /auth/google 401 - missing token", async () => {
  const { status } = await request(app()).post(apiRoot + "/google");
  expect(status).toBe(401);
});
