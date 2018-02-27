const possibleSfcExpressions = [];
const possibleSfcDeclarations = [];

function getReferencedPropertyNames(t, bindings) {
  return bindings.referencePaths
    .filter(ref => t.isMemberExpression(ref.parent) && !ref.parent.computed)
    .map(
      ref =>
        t.isMemberExpression(ref.parent) && t.isIdentifier(ref.parent.property)
          ? ref.parent.property.name
          : ''
    );
}

function duckTypesAsSFC(t, bindings) {
  const propertyNames = getReferencedPropertyNames(t, bindings);
  return (
    propertyNames.includes('displayName') || propertyNames.includes('propTypes')
  );
}

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclarator(path) {
        if (
          !t.isFunction(path.node.init) ||
          !t.isIdentifier(path.node.id) ||
          !duckTypesAsSFC(t, path.scope.getBinding(path.node.id.name)) ||
          path.node.id.typeAnnotation
        ) {
          return;
        }

        path.node.id.typeAnnotation = t.tSTypeAnnotation(
          t.tSTypeReference(
            t.tSQualifiedName(t.identifier('React'), t.identifier('SFC')),
            t.tSTypeParameterInstantiation([t.tSAnyKeyword()])
          )
        );
      },

      FunctionDeclaration(path) {
        if (!duckTypesAsSFC(t, path.scope.getBinding(path.node.id.name)))
          return;
        const asExpression = t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(path.node.id.name),
            t.arrowFunctionExpression(path.node.params, path.node.body)
          )
        ]);
        path.replaceWith(asExpression);
      },

      Program: {
        exit() {
          //console.log(functions);
        }
      }
    }
  };
};
