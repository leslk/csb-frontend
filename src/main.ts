import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue3-carousel/dist/carousel.css'

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(Vue3Toasity, { autoClose: 3000, position: 'top-right' } as ToastContainerOptions);
app.use(router);

app.mount('#app');
