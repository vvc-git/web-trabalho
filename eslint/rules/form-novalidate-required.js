module.exports = {
  create: context => {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === 'form' && node.attributes.filter(attr => attr.name.name === 'noValidate').length === 0) {
          context.report(node, 'Property "noValidate" is required for <form> elements')
        }
      },
    }
  },
}
