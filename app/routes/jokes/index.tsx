import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
    select: { content: true },
  });
  return { joke: randomJoke };
};

export default function JokesIndexRoute() {
  const { joke } = useLoaderData<{ joke: Pick<Joke, "content"> }>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
    </div>
  );
}
