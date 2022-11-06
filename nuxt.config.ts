// https://v3.nuxtjs.org/api/configuration/nuxt.config

import AutoImport from 'unplugin-auto-import/vite'
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from "unplugin-icons/resolver";
const lifecycle = process.env.npm_lifecycle_event;

export default defineNuxtConfig({
    typescript: {
        shim: false
    },
    vite: {
        plugins: [
            AutoImport({
                resolvers: [
                    ElementPlusResolver(),
                    IconsResolver()
                ]
            }),
            Components({
                dts: true,
                resolvers: [ElementPlusResolver(
                    {
                        importStyle: false
                    }
                )]
            }),
        ],
    },
    components: true,
    transpile: ["element-plus"],
    build: {
        transpile: lifecycle === "build" ? ["element-plus"] : [],
    },
    css: [
        'element-plus/dist/index.css',
        'assets/styles/values.less'
    ],
    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    // 自动引入 `usePinia()`
                    'defineStore',
                    // 自动引入 `usePinia()` 并重命名为 `usePiniaStore()`
                    ['defineStore', 'definePiniaStore'],
                ],
            },
        ],
    ],
   

})
