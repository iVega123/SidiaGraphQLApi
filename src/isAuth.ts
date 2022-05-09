import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { iContext } from "./context";

export const isAuth: MiddlewareFn<iContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, "APP_Sidia");
    context.payload = payload as any;
  } catch (err) {
    throw new Error("Not authenticated");
  }
  return next();
};