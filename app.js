const React = require('react');
const styled = require('styled-components/macro');
const styleImport = require('./macro/index');

const sectionRules = styleImport('./external.css', {title: '.foo .section', bar: '.bar'});
console.log(sectionRules);

const Title = styled.div`
  color: blue;
  ${sectionRules.title}
`;

module.exports = () => <div>foo<Title>Foo</Title></div>
