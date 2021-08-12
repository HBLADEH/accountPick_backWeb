import * as path from 'path';
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { setNodeEnv } from "./src/utils/env";
import { vitePluginStore } from "./src/utils/store";
import { vitePluginLocales } from "./src/utils/i18n";
import { vitePluginMock } from "./src/utils/mock";
import { vitePluginIconSvg } from "./src/components/IconSvg/plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {

  // 自定义设置 nodejs .env
  setNodeEnv(mode);

  // 开发服务器端口
  const port: number = parseInt(process.env.APP_PORT || '3000');

  // 插件
  const plugins: (Plugin | Plugin[])[] = [
    vue(),
    vitePluginStore(),
    vitePluginLocales(),
    vitePluginIconSvg(),
  ]

  // vitePluginMock
  mode === 'development' && process.env.APP_MOCK === 'true' && plugins.push(vitePluginMock());

  // @vitejs/plugin-legacy
  command === 'build' && plugins.push(legacy());

  return {
    base: '/',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port,
    }
    // server: {
    //   port: port,
    //   open: false, //自动打开 
    //   proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
    //     // 正则表达式写法
    //     '^/api': {
    //       target: 'http://localhost:5000/v1', // 后端服务实际地址
    //       changeOrigin: true, //开启代理
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // },
  }
})
