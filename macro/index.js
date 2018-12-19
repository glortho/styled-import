const fs   = require('fs');
const path = require('path');
const css  = require('css');

const {createMacro} = require('babel-plugin-macros')

module.exports = createMacro(styleImportMacro);

function styleImportMacro({references, state, babel}) {
  references.default.forEach(referencePath => {
    const [ cssPathArg, selectorArg ] = referencePath.parentPath.get('arguments');
    const cssRules = parseAst(state.file.opts.filename, cssPathArg.node.value).stylesheet.rules;
    const declarations = (
      selectorArg.node.value ?
        parseStringOfSelectors(cssRules, selectorArg.node.value, babel) :
      selectorArg.node.elements ?
        parseArrayOfSelectors(cssRules, selectorArg.node.elements, babel) :
      parseObjectOfSelectors(cssRules, selectorArg.node.properties, babel)
    )
    const fnCallPath = cssPathArg.parentPath;
    fnCallPath.replaceWith(declarations);
  });
}

const stringifyDeclarations = declarations =>
  declarations.map(item => `${item.property}: ${item.value}`).join('\n') + '\n'

const parseArrayOfSelectors = (cssRules, elements, babel) => {
  const declarations = cssRules
    .filter( rule => rule.selectors.some( selector => !!elements.find(node => node.value === selector) ))
    .map( rule => babel.types.stringLiteral(stringifyDeclarations(rule.declarations)) )
  return babel.types.ArrayExpression(declarations)
}

const parseObjectOfSelectors = (cssRules, properties, babel) => {
  const declarations = properties.map(item => {
    const key = item.key.name;
    const value = item.value.value;
    const rule = cssRules
      .find( rule => rule.selectors.some( selector => selector === value ))
    return babel.types.objectProperty(
      babel.types.stringLiteral(key),
      babel.types.stringLiteral( rule ? stringifyDeclarations(rule.declarations) : rule )
    )
  });
  return babel.types.ObjectExpression(declarations)
}

const parseStringOfSelectors = (cssRules, value, babel) => {
  const rules = cssRules.find( rule => rule.selectors.some( selector => selector === value ))
  const declarations = stringifyDeclarations(rules.declarations)
  return babel.types.stringLiteral(declarations)
}

const parseAst = (modulePath, cssPath) => {
  // TODO: require.resolve?
  const pathHint = modulePath.charAt(0)
  const pathReference = (
    pathHint === '/' ?
      path.dirname(modulePath) :
    pathHint === '.' ?
      path.join(process.cwd(), path.dirname(modulePath)) :
    path.join(process.cwd(), 'node_modules', path.dirname(modulePath))
  )
  const absolutePath = path.join(pathReference, cssPath)
  const cssString = fs.readFileSync(absolutePath, 'utf-8')
  return css.parse(cssString, {source: absolutePath})
}
