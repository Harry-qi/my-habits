module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'default-case': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
  },
};
