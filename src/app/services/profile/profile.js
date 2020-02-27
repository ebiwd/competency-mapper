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

    let doc = new jsPDF('p', 'pt', 'a4');

    let currentDate = moment().format('MMMM D, Y');
    let currentTime = moment().format('hh:mm:ss');

    let pdfWidth = doc.internal.pageSize.getWidth();
    let pdfHeight = doc.internal.pageSize.getHeight();

    let marginleft = 20;
    let col = pdfWidth * 0.07383;
    let gutter = pdfWidth * 0.01036727272;
    let fourthCol = col * 4 + gutter * 3;

    let pdfProfileImgWidth = 180;
    let selectedFileWidth = options.selectedFile
      ? options.selectedFileData[0].width
      : 180;
    let selectedFileHeight = options.selectedFile
      ? options.selectedFileData[0].height
      : 150;
    let ratio = selectedFileWidth / selectedFileHeight;
    let pdfProfileImgHeight = pdfProfileImgWidth / ratio;

    // PROFILE IMAGE
    if (options.selectedFile) {
      let type = options.selectedFile.type === 'image/jpeg' ? 'JPEG' : 'PNG'; // maybe you should add some controls to prevent loading of other file types
      let imgData = options.selectedFileData[0].src;
      doc.addImage(
        imgData,
        type,
        marginleft,
        40,
        pdfProfileImgWidth,
        pdfProfileImgHeight,
        '',
        'SLOW'
      ); // Compression options are NONE, FAST, MEDIUM and SLOW
    }
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(
      marginleft,
      pdfProfileImgHeight + 60,
      options.gender + ', ' + options.age + ' years'
    );

    // PROFILE HEADER
    doc.setFontType('bold');
    doc.setFontSize(20);
    doc.text(marginleft, 20, 'EMBL-EBI Competency Profile');

    // PROFILE BODY
    doc.setFontSize(16);
    doc.text(240, 60, options.title + ' - ' + options.jobTitle);

    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(240, 90, 'Qualifications & background: ' + options.qualification);
    doc.text(240, 120, 'Activities and current role: ' + options.currentRole);

    doc.setFontSize(9);
    doc.text(
      marginleft,
      500,
      'Profile created on ' + currentDate + ' at ' + currentTime
    );

    // Save the Data
    let jobTitleUnderscored = options.jobTitle.split(' ').join('_');
    doc.save(jobTitleUnderscored.toLowerCase() + '.pdf');
  }
}

export default ProfileService;
