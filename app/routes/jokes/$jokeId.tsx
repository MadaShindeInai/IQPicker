import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true },
  });
  if (!joke) throw new Error("Joke not found");
  return { joke };
};

export default function JokeRoute() {
  const { joke } = useLoaderData<{
    joke: Pick<Joke, "content" | "name"> | null;
  }>();
  console.log(joke);
  if (!joke) {
    return <div>That's not fun!</div>;
  }
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}
