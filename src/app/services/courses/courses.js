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
      `${apiUrl}/api/resources?_format=json&page=${page}&title=${filter}&type=${filterType}`
    );
    return response.data;
  }
}

export default CoursesService;
