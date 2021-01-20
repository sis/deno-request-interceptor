import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (context) => {
  const { request: { method, url: { pathname } }} = context;
  const headers = await context.request.headers.entries();
  const reqBody = await context.request.body({ type: 'raw' }).value;

  const startDate = new Date();
  const start = performance.now();
  const url = `http://localhost:11040${pathname}`;

  try {
    const res = await fetch(
      url,
      {
        method,
        headers: Array.from(headers),
        body: reqBody,
      }
    );
    

    const end = performance.now();
    const timeTaken = end - start;
  
    console.log('time taken in ms:', timeTaken);
  
    // Set the body
    const response = await res.text();
    context.response.body = response;
  
    const resHeaderEntries = await res.headers.entries();
    const resHeaders = Array.from(resHeaderEntries);
  
    const reqBodyText = await context.request.body({ type: 'text' }).value;
    const date = new Date();
    const json = {
      timestamp: date.toISOString(),
      requestStarted: startDate.toISOString(),
      timeTakenMs: timeTaken,
      url,
      request: reqBodyText,
      response,
    };
  
    Deno.writeTextFile(
      './data/logs.json',
      `${JSON.stringify(json)}\n`,
      { append: true, create: true },
    );
  
    context.response.headers = new Headers(resHeaders);
  } catch (e) {
    console.log('found e', e);
  }
});

console.log('listening on port', 8000);
await app.listen({ port: 8000 });
