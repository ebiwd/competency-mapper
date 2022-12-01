export function slugify(string) {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function extractSlugFromBackendUrl(url) {
  return url.split('/')[4].split('?')[0];
}
