// On-demand vocabulary loading. The full word data is split into one chunk per
// theme (src/content/vocab/t/<theme>.js); this module loads the small manifest
// up front and fetches each theme's full entries only when they are needed.
const themeLoaders = import.meta.glob("./vocab/t/*.js");
const FILES = {};
for (const p of Object.keys(themeLoaders)) {
  const m = p.match(/\/([^/]+)\.js$/);
  if (m) FILES[m[1]] = themeLoaders[p];
}

const cache = {};

export async function loadManifest() {
  const m = await import("./vocab/manifest.js");
  return m.INDEX;
}

export async function loadTheme(theme) {
  if (cache[theme]) return cache[theme];
  const loader = FILES[theme];
  if (!loader) return [];
  const mod = await loader();
  cache[theme] = mod.default || [];
  return cache[theme];
}

export async function loadThemes(themes) {
  const uniq = Array.from(new Set(themes)).filter(Boolean);
  const loaded = await Promise.all(uniq.map(t => loadTheme(t).then(arr => [t, arr])));
  const map = {};
  for (const [t, arr] of loaded) map[t] = arr;
  return map;
}
