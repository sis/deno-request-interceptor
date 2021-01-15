import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (context) => {
  const { request: { method, url: { pathname } }} = context;
  const headers = await context.request.headers.entries();

  const start = performance.now();
  const url = `http://localhost:11040${pathname}`;

  const res = await fetch(
    url,
    {
      method,
      headers: Array.from(headers),
    }
  );

  const end = performance.now();
  const timeTaken = end - start;

  console.log('time taken in ms:', timeTaken);

  // Set the body
  const responseText = await res.text();
  context.response.body = responseText;

  const resHeaderEntries = await res.headers.entries();
  const resHeaders = Array.from(resHeaderEntries);

  const text = await Deno.readTextFile("./data/logs.json");
  let json = JSON.parse(text);
  json.push({ timeTakenMs: timeTaken, url, responseText })
  Deno.writeTextFile('./data/logs.json', JSON.stringify(json));
  console.log('tejsonxt', json);

  context.response.headers = new Headers(resHeaders);
});

await app.listen({ port: 8000 });
