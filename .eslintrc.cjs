module.exports = {
  extends: ['next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'import/order': ['error', { groups: ['builtin', 'external', 'internal'], 'newlines-between': 'always' }],
    'react/jsx-no-target-blank': 'off'
  }
};
