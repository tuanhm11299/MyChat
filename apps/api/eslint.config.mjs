// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Besides the usual TypeScript rules, this file enforces the architecture, so
 * a broken layer boundary fails `pnpm lint` instead of relying on code review.
 * See docs/architecture/backend.md ("Dependency rules").
 */
export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'eslint.config.mjs'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Rule 1: the domain layer is plain TypeScript. It must not depend on
  // frameworks, the database, or the outer layers of the module.
  {
    files: ['src/**/domain/**/*.ts'],
    ignores: ['src/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*', 'typeorm', 'express', 'pg'],
              message: 'The domain layer must not depend on frameworks or the database.',
            },
            {
              regex: '/(features|infrastructure)/',
              message: 'The domain layer must not import from features/ or infrastructure/.',
            },
          ],
        },
      ],
    },
  },

  // Rule 2: vertical slices are independent. A slice may use its module's
  // domain/ and infrastructure/ but never another slice. Share behavior
  // through the domain or through events instead.
  {
    files: ['src/modules/*/features/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // "../sibling-slice/..." or any path that goes through a features/ folder
              regex: '^(\\.\\./(?!\\.\\.)|(?!\\./).*/features/)',
              message:
                'A slice must not import another slice. Move shared logic to domain/ or use an event.',
            },
          ],
        },
      ],
    },
  },
);
