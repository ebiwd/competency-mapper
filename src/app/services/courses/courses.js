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

  async checkForTrainingResources(page, filter, filterType, $framework) {
    // console.log('given framework', $framework);
    // let frameworkName = '';
    // switch ($framework) {
    //   case 'bioexcel':
    //     frameworkName = 'BioExcel';
    //     break;
    //   case 'corbel':
    //     frameworkName = 'CORBEL';
    //     break;
    //   case 'ritrain':
    //     frameworkName = 'RITrain';
    //     break;
    //   case 'iscb':
    //     frameworkName = 'ISCB';
    //     break;
    //   case 'nhs':
    //     frameworkName = 'NHS';
    //     break;
    //   case 'cineca':
    //     frameworkName = 'CINECA';
    //     break;
    //   case 'datasteward':
    //     frameworkName = 'Data Steward';
    //     break;
    //   case 'permedcoe':
    //     frameworkName = 'PerMedCoE';
    //     break;
    // }
    const response = await this.http.get(
      `${apiUrl}/api/competency_framework_resources?_format=json&timestamp=${Date.now()}&page=${page}&title=${filter}&type=${filterType}&framework=${$framework}&checkForTrainingResources=${true}`
    );
    return response.data;
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
