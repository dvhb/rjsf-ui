import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import module from 'module';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  external: ['react', 'moment'].concat(
      module.builtinModules || Object.keys(process.binding('natives'))
  ),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.(tsx|ts)'],
    }),
    json(),
    resolve({ jsnext: true, preferBuiltins: true, browser: true }),
    commonjs(),
  ],
};
