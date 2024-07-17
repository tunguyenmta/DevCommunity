export const DOCUMENT_TEMPLATES = {
    HTML: (code: { html: string; css: string; javascript: string }) =>
        `<html><head><style>
        * {
            box-sizing: border-box;
        }
        ${code.css}
        </style></head>
        <body>
         ${code.html}
        <script>${code.javascript}${disableClickScript}</script>
        </body></html>`,
    CSS: (code: { html: string; css: string; javascript: string }) =>
        `<html><head><style>
        * {
            box-sizing: border-box;
        }
        ${code.css}
        </style></head>
        <body style="width: 100%; margin:0 auto;overflow: hidden;">
        <div style="height:100vh;display: flex;justify-content: center;align-items: center;">
        ${code.html}
        </div>
        <script>${code.javascript}${disableClickScript}</script>
        </body></html>`,
    JavaScript: (code: { html: string; css: string; javascript: string }) =>
        `<html><head><style>
        * {
            box-sizing: border-box;
        }
        ${code.css}
        </style></head>
        <body style="width: 100%; margin:0 auto;overflow: hidden;">
        <div style="height:100vh;display: flex;justify-content: center;align-items: center;">
        ${code.html}
        </div>
        <script>${code.javascript}${disableClickScript}</script>
        </body></html>`,
    defaultContent: () =>
        `<html><head></head><body></body></html>`
};


const disableClickScript = `
    document.addEventListener('DOMContentLoaded', function() {
        document.body.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'A' && target.hasAttribute('href')) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, true);
    });

`;

