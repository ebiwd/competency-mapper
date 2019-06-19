#!/usr/bin/env node
const fs = require('fs');

const fileName = process.argv[2];
const content = fs.readFileSync(fileName, 'utf-8');
const firstLine = content.split('\n')[0];
const hint = `#[feat|fix|docs|style|refactor|perf|test|chore]:-|

#[what/why]

`;

if (firstLine === '') {
  fs.writeFileSync(fileName, `${hint}${content}`);
}
