import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Terry's Terminal Portfolio - An interactive command-line style portfolio" />
        <meta name="author" content="Terry" />
        <meta name="theme-color" content="#0a0a0a" />
        <title>Terry's Terminal Portfolio</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='20' font-size='20'>💻</text></svg>" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
