import { compile } from 'sass';
import { resolve } from 'path';
import { Plugin } from 'esbuild';

const pluginName = 'esbuild-plugin-sass';

const plugin: Plugin = {
  name: pluginName,
  setup(build) {
    build.onResolve({ filter: /\.s[ac]ss$/ }, (args) => ({
      path: resolve(args.resolveDir, args.path),
      namespace: pluginName,
    }));

    build.onLoad({ filter: /.*/, namespace: pluginName }, async (args) => {
      try {
        const result = compile(args.path);
        return {
          contents: result.css,
          loader: 'css',
          watchFiles: [args.path],
        };
      } catch (error) {
        return {
          pluginName,
          errors: [
            {
              text:
                error instanceof Error ? error.message : JSON.stringify(error),
              pluginName,
              location: { file: args.path, namespace: pluginName },
            },
          ],
        };
      }
    });
  },
};

export default plugin;
