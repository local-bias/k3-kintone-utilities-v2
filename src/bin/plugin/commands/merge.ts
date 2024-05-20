import { readJsonSync, writeJsonSync } from 'fs-extra';
import path from 'path';
import { program } from 'commander';

export default function command(): void {
  program.command('manifest').option('-e, --env <env>', 'create manifest', 'prod').action(action);
}

function merge(src: Record<string, any>, dst: Record<string, any>): Record<string, any> {
  return Object.entries(src).reduce((acc, [key, value]) => {
    if (!dst[key]) {
      return { ...acc, [key]: value };
    }

    if (typeof dst[key] === 'string') {
      return { ...acc, [key]: dst[key] };
    }

    if (Array.isArray(value) && Array.isArray(dst[key])) {
      return { ...acc, [key]: [...value, ...dst[key]] };
    }

    return { ...acc, [key]: merge(src[key], dst[key]) };
  }, {});
}

function action(options: { env: string }): void {
  const { env } = options;
  if (env !== 'prod' && env !== 'dev' && env !== 'standalone') {
    throw new Error('Invalid environment');
  }

  const config: Plugin.Env = readJsonSync(path.join(process.cwd(), 'manifest.json'));

  const merged = merge(config.manifest.base, config.manifest[env] || {});

  writeJsonSync(path.join(process.cwd(), '.plugin', 'out', 'manifest.json'), merged);
}
