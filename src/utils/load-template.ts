import { compile } from 'handlebars';
import { readFile } from 'node:fs/promises';

const isProd = Bun.env.NODE_ENV === 'production';
const cache = new Map<string, Handlebars.TemplateDelegate>();

/** Render handlebars file relative to the `templates` directory into string. */
export default async function loadTemplate<T extends Object, N extends string>(name: N, data?: T) {
  const path = `templates/${name}.hbs`;
  let hbs = cache.get(path);
  if (isProd && hbs) return hbs(data).trim();

  const buffer = await readFile(path);
  let content = buffer.toString('utf-8');
  hbs = compile(content);

  cache.set(path, hbs);
  return hbs(data).trim();
}
