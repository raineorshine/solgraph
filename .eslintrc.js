module.exports = {
  env: {
    es6: true,
    mocha: true,
    node: true,
  },
  extends: ['standard', 'eslint:recommended', 'raine', 'prettier'],
  plugins: ['fp', 'jsdoc'],
  rules: {
    'jsdoc/require-jsdoc': [
      2,
      {
        contexts: ['VariableDeclarator > ArrowFunctionExpression'],
        require: {
          ClassDeclaration: true,
          ClassExpression: true,
        },
      },
    ],
  },
}
