import * as esbuild from 'esbuild';

const reflectServerFileName = 'reflect-server.js';

const replaceReflectServerPlugin: esbuild.Plugin = {
  name: 'replace-reflect',
  setup(build) {
    build.onResolve({filter: /^@rocicorp\/reflect\/server$/}, () => ({
      path: `./${reflectServerFileName}`,
      external: true,
    }));
  },
};

export async function compile(
  entryPoint: string,
): Promise<{code: esbuild.OutputFile; sourcemap: esbuild.OutputFile}> {
  const res = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    sourcemap: 'external',
    target: 'esnext',
    plugins: [replaceReflectServerPlugin],
    minify: false,
    write: false,
    loader: {
      '.example': 'ts',
    },
    outdir: '.',
  });
  const {errors, outputFiles} = res;
  if (errors.length > 0) {
    throw new Error(res.errors.join('\n'));
  }
  // 1 for the bundle, 1 for the sourcemap
  if (outputFiles.length !== 2) {
    throw new Error('Unexpected output from esbuild');
  }

  if (outputFiles[0].path.endsWith('.map')) {
    outputFiles.reverse();
  }
  return {code: outputFiles[0], sourcemap: outputFiles[1]};
}
