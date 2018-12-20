
# Styled Import
> Extreme lightweight CSS parser for stealing rules from stylesheets (without adding the stylesheet to your bundle), to compose into [Styled Components](https://www.styled-components.com/) or anywhere else you might be doing CSS in JS.

[![npm package](https://badge.fury.io/js/styled-import.svg)](https://badge.fury.io/js/styled-import)
[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/glortho/styled-import/issues)

## Motivation

Working with global or 3rd party CSS creates constant challenges when implementing other CSS solutions. This is meant to ease some of the pain by letting you steal styles from those stylesheets without needing to link or bundle or otherwise include the stylesheets themselves.

Note that this library currently operates as a Babel macro, replacing all
references to styled-import calls at compile-time with the actual style declarations from the
referenced stylesheets.

## Installation

```
$ npm install -D styled-import
```

## Dependencies

Styled Import currently runs only as a Babel macro, so be sure you have
configured Babel to use [babel-plugin-macros](https://www.npmjs.com/package/babel-plugin-macros).

Here is one example of how to do that:

_.babelrc_

```javascript
{
  "plugins": ["macros"]
}
```

NOTE: Macros are included in create-react-app 2 by default.

## Use

_./stylesheets/global.css_

```css
.button {
  color: blue;
}
```

_./component.js_

```javascript
const styledImport = require('styled-import/macro')

const btnStyle = styledImport('./stylesheets/global.css', '.button')

console.log(btnStyle) // 'color: blue;'
```

#### Use with Styled Components

```javascript
const styled = require('styled-components')
const styledImport = require('styled-import/macro')

const btnStyle = styledImport('./stylesheets/global.css', '.button')

const Button = styled.button`
  padding: 10px;
  ${btnStyle}
`
```

String composition works like inheritance/cascade:

```javascript
const btnBlue = styledImport('./stylesheets/global.css', '.button-blue')

const Button = styled.button`
  color: green;
  padding: 10px;
  ${btnBlue}
`

// color: green is overridden by color: blue in btnBlue
```

#### Use with React or other CSS-in-JS

```javascript
const btnStyle = styledImport.react('./stylesheets/global.css', '.button')

// btnStyle is now an object {'color': 'blue'} with camelCased properties, instead of a CSS string
```

#### Import from node_modules stylesheet

```javascript
const btnStyle = styledImport('@org/stylesheets/global.css', '.button')
```

#### Import multiple styles


```javascript
const [ btnStyle, headerStyle ] = styledImport('@org/stylesheets/global.css', ['.button', '.header'])

const { button, header } = styledImport('@org/stylesheets/global.css', {button: '.button', header: '.header'})
```

#### Import nested styles

```javascript
const cardBtnStyle = styledImport('./stylesheets/global.css', '.card .button')
```

## Test

```
$ npm run dev && npm test
```

NOTE: Tests will only run in git cloned repo. They are disabled in the
published npm module.

## Restrictions

- This currently only works with static values. Dynamic arguments can/will
  break it. Some dynamic support is coming soon.
- Better error handling coming soon!
- Selectors passed as arguments must match stylesheet selectors exactly. Partial matches/regex matches coming soon.
- There is no de-duplication or other optimizations at this time. Currently styled-import just copies out the rules from the classes. It does not import the whole stylesheet into your bundle. Optimizations coming soon.
- See the warning at top -- this is experimental and untested in many
  environments! Production-ready version...you guessed it...is coming soon.

