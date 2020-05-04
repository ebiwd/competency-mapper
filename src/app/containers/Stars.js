// stars.js
const Stars = [
  { id: 0, src: process.env.PUBLIC_URL + '/rating_stars/0.png' },
  { id: 1, src: process.env.PUBLIC_URL + '/rating_stars/1.png' },
  { id: 2, src: process.env.PUBLIC_URL + '/rating_stars/2.png' },
  { id: 3, src: process.env.PUBLIC_URL + '/rating_stars/3.png' }
];

console.log('windows url ' + window.location.origin);
console.log('process url ' + process.env.PUBLIC_URL);

export default Stars;
