import HttpService from '../http/http';

export const apiUrl = process.env.REACT_APP_API_URL;

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

  async getCourses(page, filter, filterType) {
    const response = await this.http.get(
      //`${apiUrl}/api/resources?_format=json`
      // `${apiUrl}/api/resources?_format=json&page=${page}&title=${filter}&type=${filterType}`
      `${apiUrl}/api/resources?_format=json&page=${page}&title=${filter}&type=${filterType}`
    );
    return response.data;
  }

  async getByFramework(page, filter, filterType, $framework) {
    const response = await this.http.get(
      `${apiUrl}/api/competency_framework_resources?_format=json&timestamp=${Date.now()}&page=${page}&title=${filter}&type=${filterType}&framework=${$framework}`
    );
    console.log('resp data', response.data);
    return response.data;
  }

  async getByCompetency($competencyID) {
    const response = await this.http.get(
      `${apiUrl}/api/competency-resources?field_competency_target_id=${$competencyID}`
    );
    return response.data;
  }
}

export default CoursesService;
