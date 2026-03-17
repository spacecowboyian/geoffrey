import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D8nBsXZG.mjs';
import { manifest } from './manifest_B_h3tPw7.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/keystatic/_---params_.astro.mjs');
const _page3 = () => import('./pages/build-log/_slug_.astro.mjs');
const _page4 = () => import('./pages/build-log.astro.mjs');
const _page5 = () => import('./pages/keystatic/_---params_.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/about.astro", _page1],
    ["node_modules/@keystatic/astro/internal/keystatic-api.js", _page2],
    ["src/pages/build-log/[slug].astro", _page3],
    ["src/pages/build-log/index.astro", _page4],
    ["node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///home/runner/work/geoffrey/geoffrey/dist/client/",
    "server": "file:///home/runner/work/geoffrey/geoffrey/dist/server/",
    "host": "127.0.0.1",
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
