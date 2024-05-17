import chalk from 'chalk';
import esbuild, { BuildOptions } from 'esbuild';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import sassPlugin from './esbuild-sass-plugin.js';

export const buildWithEsbuild = async (props: {
  mode: 'app' | 'plugin';
  srcRoot: string;
  distRoot: string;
}) => {
  const { mode, srcRoot, distRoot } = props;

  let entryPoints: BuildOptions['entryPoints'] = [];
  if (mode === 'app') {
    const root = join(cwd(), srcRoot, 'apps');

    const allProjects = readdirSync(root);

    entryPoints = allProjects.reduce<{ in: string; out: string }[]>(
      (acc, dir) => {
        for (const filename of ['index.ts', 'index.js', 'index.mjs']) {
          if (existsSync(join(root, dir, filename))) {
            return [...acc, { in: join(root, dir, filename), out: dir }];
          }
        }
        return acc;
      },
      []
    );
  } else {
    entryPoints = ['desktop', 'config'].map((dir) =>
      join(srcRoot, dir, 'index.ts')
    );
  }

  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    sourcemap: 'inline',
    platform: 'browser',
    outdir: join(...distRoot.split(/[\\\/]/g)),
    plugins: [
      {
        name: 'on-end',
        setup: ({ onEnd }) =>
          onEnd(() =>
            console.log(
              chalk.hex('#d1d5db')(`${new Date().toLocaleTimeString()} `) +
                chalk.cyan(`[content] `) +
                `変更を反映しました`
            )
          ),
      },
      sassPlugin,
    ],
  });

  context.watch();
};
