export default {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["@nuxt/eslint-config", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
