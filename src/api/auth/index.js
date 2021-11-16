import { Router } from "express";
import { login, basicLogin } from "./controller";
import { middleware as body } from "bodymen";
import { schema } from "../user/model";
export User, { schema } from "../user/model";
import { google, master } from "../../services/passport";

const router = new Router();
const { email, password } = schema.tree;

router.post("/", master(), body({ email, password }), basicLogin);
router.post("/google", google(), login);

export default router;
