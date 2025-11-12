import type { Response } from "express";

export const setAuthCookie = ( token: string, res: Response,) => {
  return res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
