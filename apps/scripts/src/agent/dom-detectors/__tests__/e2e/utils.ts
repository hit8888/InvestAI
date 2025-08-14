import path from "path";
import http from "http";
import fs from "fs";
import { Page, Request } from "@playwright/test";

export async function startServer(): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    let filePath;
    const requestUrl = req.url ?? "";
    const isAssetRequest = requestUrl.endsWith(".js");

    if (isAssetRequest) {
      filePath = path.join(__dirname, "..", "..", "..", requestUrl);
    } else {
      filePath = path.join(
        __dirname,
        "..",
        "__mocks__",
        requestUrl === "/" ? "index.html" : requestUrl,
      );
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err !== null) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = path.extname(filePath);
      const contentType =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
        }[ext] || "text/plain";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });

  // Start server on a random port
  await new Promise<void>((resolve) => server.listen(0, resolve));

  return server;
}

export async function waitForRequest(
  page: Page,
  urlFragment: string,
  timeout = 20000,
) {
  const urlFragmentRegExp = new RegExp(urlFragment);

  return new Promise<Request>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(
        new Error(
          `Request with URL containing "${urlFragment}" not found within ${timeout}ms`,
        ),
      );
    }, timeout);

    page.on("request", (request) => {
      if (request.url().match(urlFragmentRegExp)) {
        clearTimeout(timeoutId);
        resolve(request);
      }
    });
  });
}
