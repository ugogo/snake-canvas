module.exports = {
  extends: ["prettier"],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    "arrow-parens": 0,
    "prettier/prettier": 2
  },
};
