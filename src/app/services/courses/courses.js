import HttpService from '../http/http';

export const apiUrl = process.env.REACT_APP_API_URL;

class CoursesService {
  static instance;
  http = new HttpService();

  constructor() {
    if (CoursesService.instance) {
      return this.instance;
    }

    CoursesService.instance = this;
  }

  async getCourses() {
    const response = await this.http.get(
      /*`${apiUrl}/api/v1/training-resources/all?_format=json`*/
      `${apiUrl}/api/resources?_format=json&timestamp=${Date.now()}`
    );
    return response.data;
  }
}

export default CoursesService;
