import HttpService from '../http/http';
import Body from './body';

export const apiUrl = process.env.REACT_APP_API_URL;

class CompetencyService {
  static instance;
  http = new HttpService();

  constructor() {
    if (CompetencyService.instance) {
      return this.instance;
    }

    CompetencyService.instance = this;
  }

  async getFramework(framework) {
    const response = await this.http.get(
      `${apiUrl}/api/v1/framework/${framework}?_format=json`
    );
    return response.data;
  }

  // TODO: change name
  async getVersionedFramework(framework, version) {
    const response = await this.http.get(
      `${apiUrl}/api/${framework}/${version}?_format=json`
    );
    return response.data;
  }

  async getAllFrameworks() {
    const response = await this.http.get(
      `${apiUrl}/api/v1/framework/?_format=json`
    );
    return response.data;
  }

  // TODO: change name
  async getAllVersionedFrameworks() {
    const response = await this.http.get(
      `${apiUrl}/api/version_manager/?_format=json`
    );
    return response.data;
  }

  async createAttribute(options) {
    const response = await this.http.post(
      `${apiUrl}/node?_format=hal_json`,
      Body.createAttribute(options)
    );

    return response.data;
  }

  async createCompetency(options) {
    const response = await this.http.post(
      `${apiUrl}/node?_format=hal_json`,
      Body.createCompetency(options)
    );

    return response.data;
  }

  async patchCompetency(competencyId, key, value) {
    const response = await this.http.patch(
      `${apiUrl}/node/${competencyId}?_format=hal_json`,
      Body.mutateCompetency(key, value)
    );

    return response.data;
  }

  async patchAttribute(attributeId, key, value) {
    const response = await this.http.patch(
      `${apiUrl}/node/${attributeId}?_format=hal_json`,
      Body.mutateAttribute(key, value)
    );

    return response.data;
  }
}

export default CompetencyService;
