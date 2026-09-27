import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Next.js recommended rules, plus one architecture rule:
 * a feature folder must not reach into another feature's internals.
 * See docs/architecture/web.md.
 */
const config = [
  { ignores: ['.next/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/features/',
              message:
                'Features must not import each other. Move shared code to src/lib or src/components.',
            },
          ],
        },
      ],
    },
  },
];

export default config;
