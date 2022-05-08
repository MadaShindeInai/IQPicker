import { db } from "./db.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

type Login = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: Login) => {
  const existingUser = await db.user.findFirst({
    where: { username },
  });
  if (!existingUser) return null;
  const passwordsMatch = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );
  if (!passwordsMatch) return null;
  return existingUser;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable not set");
}

const storage = createCookieSessionStorage({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 1 week
    path: "/",
    name: "RJ_session",
    secrets: [sessionSecret],
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
};
