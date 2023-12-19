import App from './App'

//引入三方框架
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import Http from '@/utils/http'
import Global from '@/utils/global'
import { back } from '@/utils/util'

export function createApp() {
	const app = createSSRApp(App)

	//定义全局
	app.config.globalProperties.$http = Http
	app.config.globalProperties.$global = Global
	app.config.globalProperties.$back = back
	
	//引入三方插件
	app.use(Pinia.createPinia())
	app.use(ElementPlus, {
		locale: zhCn
	})
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	  app.component(key, component)
	}
	
	return {
		app,
		Pinia
	}
}