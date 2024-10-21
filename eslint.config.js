import TSESLint from 'typescript-eslint';

const CustomRules = {
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/prefer-promise-reject-errors': 'off'
  }
};

const PerformanceParser = {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname
    }
  }
};

const NoTypeCheckOnJavascript = {
  files: ['**/*.js'],
  ...TSESLint.configs.disableTypeChecked
};

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [...TSESLint.configs.recommendedTypeChecked, PerformanceParser, CustomRules, NoTypeCheckOnJavascript];
