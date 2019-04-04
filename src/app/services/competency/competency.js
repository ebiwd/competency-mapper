import HttpService from '../http/http';
import Body from './body';

export const apiUrl = process.env.REACT_APP_API_URL;

class CompetencyService {
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
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

  async createCompetency(options) {
    const response = await this.http.post(
      `${apiUrl}/node?_format=hal_json`,
      Body.createCompetency(options)
    );

    return response.json();
  }

  async patchAttribute(aId, key, value) {
    const response = await this.http.patch(
      `${apiUrl}/node/${aId}?_format=hal_json`,
      Body.mutateAttribute(key, value)
    );

    return response.json();
  }
}

export default CompetencyService;
