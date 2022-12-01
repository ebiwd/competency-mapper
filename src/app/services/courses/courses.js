import HttpService from '../http/http';

export const apiUrl = process.env.REACT_APP_PROXY_API_URL;

class CoursesService {
  static instance;
  http = new HttpService();

  constructor(props) {
    //super(props);
    if (CoursesService.instance) {
      return this.instance;
    }

    CoursesService.instance = this;
  }

  // removed timestamp
  async checkForTrainingResources(page, filter, filterType, $framework) {
    const checkUser = localStorage.getItem('userid');
    const needTimeStamp = checkUser ? '&timestamp=' + Date.now() : '';
    const response = await this.http.get(
      `${apiUrl}/api/competency_framework_resources?_format=json&source=competencyhub&page=${page}&title=${filter}&type=${filterType}&framework=${$framework}&checkForTrainingResources=${true}&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async getCourses(page, filter, filterType) {
    const response = await this.http.get(
      //`${apiUrl}/api/resources?_format=json`
      // `${apiUrl}/api/resources?_format=json&page=${page}&title=${filter}&type=${filterType}`
      `${apiUrl}/api/resources?_format=json&source=competencyhub&page=${page}&title=${filter}&type=${filterType}`
    );
    return response.data;
  }

  async getByFramework(page, filter, filterType, $framework) {
    const response = await this.http.get(
      `${apiUrl}/api/competency_framework_resources?_format=json&source=competencyhub&page=${page}&title=${filter}&type=${filterType}&framework=${$framework}`
    );
    return response.data;
  }

  async getByCompetency($competencyID) {
    const response = await this.http.get(
      `${apiUrl}/api/competency-resources?field_competency_target_id=${$competencyID}?source=competencyhub`
    );
    return response.data;
  }
}

export default CoursesService;
