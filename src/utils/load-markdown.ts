import { readFile } from 'node:fs/promises';

/** Render markdown file relative to the `templates` directory into string. */
export default async function loadMarkdown<T extends Object, N extends string>(name: N, data?: T) {
  const path = `templates/${name}.md`;
  const buffer = await readFile(path);
  let content = buffer.toString('utf-8');

  if (data)
    for (const key in data)
      content = content.replace(new RegExp(`{{\\s?${key}\\s?}}`, 'g'), data[key] as string);

  return content.trim().replace(/(\.|#|\-|\(|\))/g, '\\$1');
}
