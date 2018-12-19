const fs   = require('fs');
const path = require('path');
const css  = require('css');

const {createMacro} = require('babel-plugin-macros')

module.exports = createMacro(styleImportMacro);

function styleImportMacro({references, state, babel}) {
  references.default.forEach(referencePath => {

    const { node } = referencePath.parentPath;

    const format = node.property
      ? node.property.name
      : 'string'

    const [ cssPathArg, selectorArg ] = node.property
      ? referencePath.parentPath.parent.arguments
      : referencePath.parentPath.get('arguments').map( arg => arg.node )

    const cssRules = parseAst(state.file.opts.filename, cssPathArg.value).stylesheet.rules;

    const declarationMethods = getDeclarationMethods(cssRules, babel, { format });

    const declarations = (
      selectorArg.value ?
        declarationMethods.byString(selectorArg.value) :
      selectorArg.elements ?
        declarationMethods.byArray(selectorArg.elements) :
      declarationMethods.byObject(selectorArg.properties)
    )

    const fnCallPath = node.property
      ? referencePath.parentPath.parentPath
      : referencePath.parentPath
    fnCallPath.replaceWith(declarations);
  });
}

const getDeclarationMethods = (cssRules, babel, options = {}) => {

  const stringifyDeclarations = declarations =>
    declarations.map(item => `${item.property}: ${item.value};`).join('\n')

  const objectifyDeclarations = declarations =>
    declarations.map(item => babel.types.objectProperty(
      babel.types.stringLiteral(toCamelCase(item.property)),
      babel.types.stringLiteral(item.value)
    ))

  const formatDeclarations = rule => options.format === 'string'
    ? babel.types.stringLiteral(stringifyDeclarations(rule.declarations))
    : babel.types.ObjectExpression(objectifyDeclarations(rule.declarations))

  const byArray = elements => {
    const declarations = elements.map( node => {
      const rule = cssRules.find( rule => rule.selectors.some( selector => node.value === selector) )
      return rule
        ? formatDeclarations(rule)
        : babel.types.nullLiteral()
    })
    return babel.types.ArrayExpression(declarations)
  }

  const byObject = properties => {
    const declarations = properties.map(item => {
      const key = item.key.name;
      const value = item.value.value;
      const rule = cssRules
        .find( rule => rule.selectors.some( selector => selector === value ))
      return babel.types.objectProperty(
        babel.types.stringLiteral(key), (
          rule
            ? formatDeclarations(rule)
            : babel.types.nullLiteral()
        )
      )
    });
    return babel.types.ObjectExpression(declarations)
  }

  const byString = value => {
    const rule = cssRules.find( rule => rule.selectors.some( selector => selector === value ))
    return rule
      ? formatDeclarations(rule)
      : babel.types.nullLiteral()
  }

  return { byString, byArray, byObject }
}

const parseAst = (modulePath, cssPath) => {
  // TODO: require.resolve?
  const pathHint = modulePath.charAt(0)
  const pathReference = pathHint === '/'
    ? path.dirname(modulePath)
    : path.join(process.cwd(), path.dirname(modulePath))
  const cssPathHint = cssPath.charAt(0)
  const cssPathReference = (
    cssPathHint === '/' ?
      cssPath :
    cssPathHint === '.' ?
      path.join(pathReference, cssPath) :
    require.resolve(cssPath)
  )
  const cssString = fs.readFileSync(cssPathReference, 'utf-8')
  return css.parse(cssString, {source: cssPathReference})
}

const toCamelCase = str => str.replace(/(-.)/g, chars => chars[1].toUpperCase())
