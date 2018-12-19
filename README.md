
# Styled Import
> Extreme lightweight CSS parser for stealing rules from stylesheets (without adding the stylesheet to your bundle), to compose into [Styled Components](https://www.styled-components.com/) or anywhere else you might be doing CSS in JS.

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

*NOTE*: This library is currently experimental. Use in production at your own
risk.

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

```
const btnBlue = styledImport('./stylesheets/global.css', '.button-blue')

const Button = styled.button`
  color: green;
  padding: 10px;
  ${btnBlue}
`

// color: green is overridden by color: blue in btnBlue
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

## Restrictions

- This currently only works with static values. Dynamic arguments can/will
  break it. Some dynamic support is coming soon.
- For now, only stringified, valid CSS declarations are returned. Support for
  object formatted return values coming soon.
- Selectors passed as arguments must match stylesheet selectors exactly. Partial matches/regex matches coming soon.
- There is no de-duplication or other optimizations at this time. Currently styled-import just copies out the rules from the classes. It does not import the whole stylesheet into your bundle. Optimizations coming soon.
- See the warning at top -- this is experimental and untested in many
  environments! Production-ready version...you guessed it...is coming soon.

## Motivation

Working with global or 3rd party CSS creates constant challenges when implementing other CSS solutions. This is meant to ease some of the pain.
