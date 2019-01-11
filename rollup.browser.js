import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import json from 'rollup-plugin-json';

export default {
	input: 'eosdaq.browser.js',
	output: {
		name: 'eosdaq',
		file: 'dist/eosdaq.js',
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