import { defineClientConfig } from "@vuepress/client";
import { setupPWA } from "E:/study/博客/guohailin.com/blog/node_modules/vuepress-plugin-pwa2/lib/client/composables/setup.js";
import SWUpdatePopup from "E:/study/博客/guohailin.com/blog/node_modules/vuepress-plugin-pwa2/lib/client/components/SWUpdatePopup.js";


export default defineClientConfig({
  setup: () => {
    setupPWA();
  },
  rootComponents: [
    SWUpdatePopup,
    
  ],
});