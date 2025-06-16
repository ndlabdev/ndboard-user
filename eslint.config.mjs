import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript'],
        rules: {
            // Indent
            'indent': ['error', 4, { SwitchCase: 1 }],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],

            // Quotes, Semi, Comma
            'quotes': ['error', 'single'],
            'semi': ['error', 'never'],
            'comma-dangle': ['error', 'never'],

            // No unused vars (bắt buộc để code sạch)
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // ignore _props, _unused

            // Object & Array formatting
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],

            // Arrow function format
            'arrow-spacing': ['error', { before: true, after: true }],
            'arrow-parens': ['error', 'always'],

            // JSX: closing tag, prop spacing
            'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
            'react/jsx-curly-spacing': ['error', { when: 'never', children: { when: 'always' } }],
            'react/jsx-equals-spacing': ['error', 'never'],

            // Newline before return
            'newline-before-return': 'error',

            // Empty line between class members, function, block
            'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: '*', next: 'return' }
            ]
        }
    })
]

export default eslintConfig
