import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./index.vue";
import router from "./router";

createApp(App).use(router).use(VueQueryPlugin).mount("#app");
