const React = require('react');
const styled = require('styled-components/macro');
const styleImport = require('../macro');

const sectionRules = styleImport('./external.css', (selector, declarations, idx) => {
  return /foo/.test(selector)
});
console.log(sectionRules);

const Title = styled.div`
  color: blue;
  ${sectionRules.title}
`;

module.exports = () => <div>foo<Title>Foo</Title></div>
