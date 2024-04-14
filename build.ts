main();

async function main() {
  const start = performance.now();
  console.log('Bundling app...');

  const result = await Bun.build({
    outdir: 'dist',
    external: ['bun:*', 'node:*', 'grammy', 'handlebars'],
    sourcemap: 'external',
    entrypoints: ['src/index.ts'],
  });

  if (result.success)
    console.log('Succesfully Bundled in', +((performance.now() - start) / 1000).toFixed(3), 'sec');
  else console.error('Build failed', ...result.logs);
}
