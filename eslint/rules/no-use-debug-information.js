module.exports = {
  create: (context) => {
    return {
      CallExpression(node) {
        if (node.callee.name === 'useDebugInformation') {
          context.report(node, '"useDebugInformation" call')
        }
      },
    }
  },
}
