import { compile } from 'handlebars';
import { readFile } from 'node:fs/promises';

/** Render handlebars file relative to the `templates` directory into string. */
export default async function loadTemplate<T extends Object, N extends string>(name: N, data?: T) {
  const path = `templates/${name}.hbs`;
  const buffer = await readFile(path);
  let content = buffer.toString('utf-8');

  return compile(content)(data).trim();
}
