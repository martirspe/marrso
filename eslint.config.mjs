import templateParser from '@angular-eslint/template-parser';
import templatePlugin from '@angular-eslint/eslint-plugin-template';
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'docs/qa/**',
      'test-results/**',
      'src/app/app.html',
    ],
  },
  {
    files: ['src/**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': templatePlugin },
    rules: {
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/valid-aria': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
    },
  },
  {
    files: ['public/theme-init.js'],
    rules: { 'no-eval': 'error', 'no-debugger': 'error', 'no-unused-vars': 'error' },
  },
];
