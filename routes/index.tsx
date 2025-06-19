import { Head } from "$fresh/runtime.ts";
import Terminal from "../islands/Terminal.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Terry's Terminal Portfolio</title>
        <meta name="description" content="Terminal-style portfolio showcasing Terry's skills and projects" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main>
        <Terminal />
      </main>
    </>
  );
}
