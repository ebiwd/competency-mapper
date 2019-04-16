class HtmlTagsService {
  static instance;
  static tagsReg = new RegExp('</?.+?/?>', 'g');

  constructor() {
    if (HtmlTagsService.instance) {
      return this.instance;
    }

    HtmlTagsService.instance = this;
  }

  remove(htmlString, replaceBy = '') {
    return htmlString.replace(HtmlTagsService.tagsReg, replaceBy);
  }

  static removeTags(htmlString, replaceBy = '') {
    return htmlString.replace(HtmlTagsService.tagsReg, replaceBy);
  }
}

export default HtmlTagsService;
