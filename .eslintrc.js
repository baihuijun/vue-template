module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-useless-escape': 'off',
    'prefer-rest-params': 'off',
    'no-tabs': 'off',
    'no-undef': 'off',
    'no-prototype-builtins': 'off',
    'require-prop-type-constructor': 'off',
    'vue/require-prop-type-constructor': 'off',
    'vue/no-async-in-computed-properties': 'off',
    'no-extend-native': 'off',
    'no-var': 'off',
    'vue/no-unused-components': 'off',
    'vue/valid-v-bind': 'off',
    'no-unused-expressions': 0,
    'no-unneeded-ternary': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-use-before-define': ['error', { functions: false, classes: false }],
    'no-empty-function': ['error', { allow: ['functions', 'methods'] }],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'space-before-function-paren': 0,
    'comma-dangle': ['error', 'never'] //是否允许对象中出现结尾逗号
  }
}
