import Header from './header';
import HttpService from '../http/http.js';

export const apiUrl = process.env.REACT_APP_API_URL;

class CompetencyService {
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
    this.header = new Header();
    this.http = new HttpService();
  }

  async getFramework(framework) {
    const response = await this.http.get(
      `${apiUrl}/api/v1/framework/${framework}?_format=json`
    );
    return response.json();
  }

  async getAllFrameworks() {
    const response = await this.http.get(
      `${apiUrl}/api/v1/framework/?_format=json`
    );
    return response.json();
  }
}

export default CompetencyService;
