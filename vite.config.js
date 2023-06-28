import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dns from "dns";
import Buffer from 'buffer';
dns.setDefaultResultOrder("verbatim");
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "/courier-frontend/";

  return defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
  });
};
