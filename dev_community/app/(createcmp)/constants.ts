export const DOCUMENT_TEMPLATES = {
    HTML: (code: { html: string; css: string; javascript: string }) =>
        `<html><head><style>  * {
            box-sizing: border-box;
        }${code.css}</style></head><body>${code.html}<script>${code.javascript}</script></body></html>`,
    CSS: (code: { html: string; css: string; javascript: string }) =>
        `<html><head>
  <style>
    * {
            box-sizing: border-box;
        }
  ${code.css}</style></head><body>${code.html}<script>${code.javascript}</script></body></html>`,
    JavaScript: (code: { html: string; css: string; javascript: string }) =>
        `<html><head>
  <style>
    * {
            box-sizing: border-box;
        }
  ${code.css}</style></head><body>${code.html}<script>${code.javascript}</script></body></html>`,
  Typescript: (code: { html: string; css: string; javascript: string }) =>
    ``,
    defaultContent: () => `<html><head></head><body></body></html>`,
};

export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    html: `<!DOCTYPE html>
       <html>
      <head>
        <title>Page Title</title>
          </head>
    <body>
        <h1>Hello, HTML!</h1>
    </body>
    </html>`,
    css: `body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
    }`,
};
