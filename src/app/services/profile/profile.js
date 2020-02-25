import HttpService from '../http/http';
import Body from './body';
import Download from './download';
import jsPDF from 'jspdf';

class ProfileService {
  static instance;
  http = new HttpService();

  constructor() {
    if (ProfileService.instance) {
      return this.instance;
    }
    ProfileService.instance = this;
  }

  async createProfile(options) {
    const response = await this.http.post(
      `/node?_format=hal_json`,
      Body.createProfile(options)
    );
    return response.data;
  }

  async editProfile(
    profileId,
    title,
    age,
    currentRole,
    gender,
    jobTitle,
    qualification,
    fileid
  ) {
    const response = await this.http.patch(
      `/node/${profileId}?_format=hal_json`,
      Body.editProfile(
        profileId,
        title,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        fileid
      )
    );

    return response.data;
  }

  downloadProfile(options) {
    Download.getProfile(options);
    console.log(options);

    var doc = new jsPDF('p', 'pt');

    doc.text(20, 20, 'Profile name: ' + options.title);
    doc.text(20, 40, 'Job title: ' + options.jobTitle);
    doc.text(20, 60, 'Age: ' + options.age);
    doc.text(20, 80, 'Gender: ' + options.gender);
    doc.text(20, 100, 'Qualification: ' + options.age);
    doc.text(20, 120, 'Current role: ' + options.currentRole);

    // Save the Data
    doc.save('Generated.pdf');
  }
}

export default ProfileService;
