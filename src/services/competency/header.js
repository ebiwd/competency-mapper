import CompetencyService, { apiUrl } from './compentency';

class Headers {
  static csfrToken;
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
    this.refreshToken();
  }

  async refreshToken() {
    const response = await fetch(`${apiUrl}/rest/session/token`);
    this.csfrToken = await response.text();
  }

  get() {
    return {
      Accept: 'application/hal+json',
      'Content-Type': 'application/hal+json',
      'X-CSRF-Token': this.csfrToken,
      Authorization: 'Basic'
    };
  }
}

export default Headers;
