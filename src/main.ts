import { createApp } from 'vue';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n, { elementPlusMessages } from '@/config/i18n';
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus, { size: 'small', locale: zhCn });
app.use(i18n);
app.mount('#app');
