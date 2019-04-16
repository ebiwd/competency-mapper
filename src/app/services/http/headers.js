class HeadersService {
  static instance;

  constructor() {
    if (HeadersService.instance) {
      return this.instance;
    }

    HeadersService.instance = this;
  }

  get() {
    const csfrToken = window.localStorage.getItem('csrf_token');
    return {
      Accept: 'application/hal+json',
      'Content-Type': 'application/hal+json',
      'X-CSRF-Token': csfrToken,
      Authorization: 'Basic'
    };
  }
}

export default HeadersService;
