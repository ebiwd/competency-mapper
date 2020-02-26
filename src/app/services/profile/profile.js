import HttpService from '../http/http';
import Body from './body';
import Download from './download';
import jsPDF from 'jspdf';
import moment from 'moment';

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
    var currentDate = moment().format('MMMM D, Y');
    var currentTime = moment().format('hh:mm:ss');

    // console.log(currentDate);
    // console.log(currentTime);

    var doc = new jsPDF('p', 'pt');

    // PROFILE HEADER

    doc.setFontType('bold');
    doc.text(20, 20, 'EMBL-EBI Competency Profile');

    // PROFILE BODY
    doc.setFontType('normal');
    doc.text(20, 60, 'Profile name: ' + options.title);
    doc.text(20, 80, 'Job title: ' + options.jobTitle);
    doc.text(20, 100, 'Age: ' + options.age);
    doc.text(20, 120, 'Gender: ' + options.gender);
    doc.text(20, 140, 'Qualification: ' + options.age);
    doc.text(20, 160, 'Activities and current role: ' + options.currentRole);

    doc.setFontSize(10);
    doc.text(
      220,
      260,
      'Profile created on ' + currentDate + ' at ' + currentTime
    );

    // Save the Data
    let jobTitleUnderscored = options.jobTitle.split(' ').join('_');
    doc.save(jobTitleUnderscored.toLowerCase() + '.pdf');
  }
}

export default ProfileService;
