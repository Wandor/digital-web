module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/destructuring-assignment': [0, 'always', { ignoreClassFields: true }],
    'import/no-unresolved': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'no-plusplus': 0,
    'react/prefer-stateless-function': 0,
    'import/no-extraneous-dependencies': 0,
    'react/default-props-match-prop-types': 0,
    'react/no-array-index-key': 0,
    'global-require': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-nested-ternary': 0,
    'react/jsx-props-no-spreading': 0,
    'jsx-a11y/label-has-associated-control': 0,
    radix: 0,
    'consistent-return': 0,
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
  },
};
