class Headers {
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
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

export default Headers;
