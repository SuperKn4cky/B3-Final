const { configs } = require('@eslint/js');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    configs.recommended,
    {
        ignores: ['dist/', 'conf/', 'coverage/'], // Répertoires ignorés
        files: ['src/**/*.ts'], // Inclure explicitement les fichiers TypeScript
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            parser: tsParser, // Utilisez le parser TypeScript
            globals: {
                ...globals.node,
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin // Utilisez le plugin comme un objet
        },
        rules: {
            semi: 'error',
            quotes: ['error', 'double'],
            indent: ['error', 4, { SwitchCase: 1 }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_'
                }
            ],
        }
    }
];