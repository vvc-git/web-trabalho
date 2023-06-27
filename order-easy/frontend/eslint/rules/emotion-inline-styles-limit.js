module.exports = {
  create: (context) => {
    return {
      JSXAttribute(node) {
        if (
          node.value &&
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'TaggedTemplateExpression' &&
          node.value.expression.tag.name === 'css' &&
          node.value.expression.quasi &&
          node.value.expression.quasi.quasis &&
          node.value.expression.quasi.quasis
            .map((e) => e.value.raw)
            .join()
            .split('\n')
            .filter((e) => e && e.trim()).length > 3
        ) {
          context.report(
            node,
            `Do not use more than 3 inline css properties. Extract the properties to a separate object to improve readability.`
          )
        }
      },
    }
  },
}
