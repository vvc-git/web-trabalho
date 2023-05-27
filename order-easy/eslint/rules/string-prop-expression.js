module.exports = {
  create: context => {
    return {
      JSXAttribute(node) {
        if (
          node.value &&
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'Literal' &&
          typeof node.value.expression.value === 'string'
        ) {
          context.report({
            node: node.value,
            message: `Do not use expression containers {'...'} for raw strings. Replace it to '...'`,
            fix: fixer => {
              return fixer.replaceText(node.value, node.value.expression.raw)
            },
          })
        }
      },
    }
  },
}
