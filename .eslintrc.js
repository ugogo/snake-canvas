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
    "implicit-arrow-linebreak": 0,
    "max-len": 0,
    "no-multi-spaces": 0,
    "no-param-reassign": 0,
    "operator-linebreak": 0,
    "prettier/prettier": 2
  },
};
