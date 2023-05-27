const forbiddenSources = ['@apollo/react-hooks']
const funcNames = ['useMutation', 'useQuery', 'useSubscription']

module.exports = {
  create: context => {
    return {
      ImportDeclaration(node) {
        if (forbiddenSources.includes(node.source.value)) {
          node.specifiers.forEach(specifier => {
            funcNames.forEach(func => {
              if (specifier.imported.name === func) {
                context.report(specifier, `"${func}" hook should be imported from "graphql/hooks"`)
              }
            })
          })
        }
      },
    }
  },
}
