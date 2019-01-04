import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import json from 'rollup-plugin-json';

export default {
	input: 'eosdaq.js',
	output: {
		name: 'eosdaq',
		file: 'dist/bundle.eosdaq.js',
		format: 'umd',
		sourcemap: true
	},
	plugins: [
    json(),
    resolve({
      preferBuiltins: true,
    }),
		commonjs({}),
		terser(),
	]
};