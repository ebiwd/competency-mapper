class HeadersService {
  static instance;

  constructor() {
    if (HeadersService.instance) {
      return this.instance;
    }

    HeadersService.instance = this;
  }

  get(type = 'hal+json') {
    const csfrToken = window.localStorage.getItem('csrf_token');
    if (type === 'json') {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': csfrToken,
        Authorization: 'Basic'
      };
    }

    return {
      Accept: 'application/hal+json',
      'Content-Type': 'application/hal+json',
      'X-CSRF-Token': csfrToken,
      Authorization: 'Basic'
    };
  }
}

export default HeadersService;
