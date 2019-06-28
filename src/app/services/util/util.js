// In modern browser (es2018), instead of `reduce` it is possible to call `flat`
export const safeFlat = array =>
  Array.prototype.flat
    ? array.flat()
    : array.reduce((acc, cur) => [...acc, ...cur], []);

const tagsReg = new RegExp('</?.+?/?>', 'g');
const nbspReg = /&nbsp;/g;

export const removeHtmlTags = (htmlString, replaceBy = '') =>
  htmlString.replace(tagsReg, replaceBy).replace(nbspReg, ' ');
