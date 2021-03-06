import path from 'path'
import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import eslint from '@rbnlffl/rollup-plugin-eslint'
const projectRoot = path.resolve(__dirname, '..')

export default {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist',
    exports: 'named'
  },
  external: ['vue', 'leaflet'],
  plugins: [
    alias({
      resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      entries: {
        '@': path.resolve(projectRoot, 'src')
      }
    }),
    nodeResolve(),
    typescript(),
    vue(),
    eslint({
      throwOnWarning: true,
      throwOnError: true
    })
  ]
}
