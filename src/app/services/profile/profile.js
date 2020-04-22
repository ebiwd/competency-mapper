import HttpService from '../http/http';
import Body from './body';
import Download from './download';
import jsPDF from 'jspdf';
import moment from 'moment';

const profileName = process.env.REACT_APP_LOCALSTORAGE_PROFILE;

class ProfileService {
  static instance;
  http = new HttpService();

  constructor() {
    if (ProfileService.instance) {
      return this.instance;
    }
    ProfileService.instance = this;
  }

  hasProfile() {
    return !!window.localStorage.getItem(profileName);
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
    additionalInfo,
    publishStatus,
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
        additionalInfo,
        publishStatus,
        fileid
      )
    );

    return response.data;
  }

  async mapProfile(profileId, mapping) {
    const response = await this.http.patch(
      `/api/profiles?_format=json`,
      Body.mapProfile(profileId, mapping),
      'json'
    );
    return response.data;
  }

  mapDownloadProfile(options) {
    localStorage.setItem(profileName, JSON.stringify(options));
  }

  downloadProfile(options) {
    // Download.getProfile(options);
    // console.log(options)

    let doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont('helvetica');
    const margin = 0.5;

    let currentDate = moment().format('MMMM D, Y');
    let currentTime = moment().format('hh:mm:ss');

    let pdfWidth = doc.internal.pageSize.getWidth();
    let pdfHeight = doc.internal.pageSize.getHeight();

    const startHeight = 30;
    const marginleft = 20;
    const pdfProfileImgWidth = 180;
    const pageLogoWidth = 100;

    let marginright = doc.internal.pageSize.getWidth() - 20;
    let col = pdfWidth * 0.07383;
    let gutter = pdfWidth * 0.01036727272;
    let fourthCol = col * 4 + gutter * 3;
    let fifthCol = col * 5 + gutter * 4;

    const profileBody = pdfWidth - fifthCol - 20;

    let selectedFileWidth = options.selectedFile
      ? options.selectedFileData[0].width
      : 180;
    let selectedFileHeight = options.selectedFile
      ? options.selectedFileData[0].height
      : 150;
    let ratio = selectedFileWidth / selectedFileHeight;
    let pdfProfileImgHeight = pdfProfileImgWidth / ratio;

    let currentYAxis = startHeight;

    // PROFILE Header
    doc.setFontType('normal');
    doc.setFontSize(22);
    doc.text(marginleft, startHeight, 'EMBL-EBI Competency Profile');

    // Framework Logo
    if (options.frameworkLogoData) {
      let frameworkLogoWidth = options.frameworkLogoData[0]
        ? options.frameworkLogoData[0].width
        : 100;
      let frameworkLogoHeight = options.frameworkLogoData[0]
        ? options.frameworkLogoData[0].height
        : 30;
      let logoRatio = frameworkLogoWidth / frameworkLogoHeight;
      let pdfLogoHeight = pageLogoWidth / logoRatio;

      let logoData = options.frameworkLogoData[0].src;
      let logoType = 'PNG';
      doc.addImage(
        logoData,
        logoType,
        marginright - 100,
        5,
        pageLogoWidth,
        pdfLogoHeight,
        '',
        'SLOW'
      );
    }

    currentYAxis = currentYAxis + 50;

    // PROFILE Title
    doc.setFontSize(18);
    doc.text(
      marginleft,
      currentYAxis,
      options.title + ' - ' + options.jobTitle
    );

    // PROFILE Image
    if (options.selectedFile) {
      let type = options.selectedFile.type === 'image/jpeg' ? 'JPEG' : 'PNG'; // maybe you should add some controls to prevent loading of other file types
      let imgData = options.selectedFileData[0].src;
      doc.addImage(
        imgData,
        type,
        marginleft,
        currentYAxis + 30,
        pdfProfileImgWidth,
        pdfProfileImgHeight,
        '',
        'SLOW'
      ); // Compression options are NONE, FAST, MEDIUM and SLOW
    }

    // doc.setFontType('normal');
    // PROFILE Demographics
    if (options.gender || options.age) {
      let gender = options.gender
        ? options.age
          ? options.gender + ', '
          : options.gender
        : '';
      let age = options.age ? options.age + ' years' : '';

      doc.setFontSize(12);
      doc.text(
        marginleft,
        pdfProfileImgHeight + currentYAxis + 60,
        gender + age
      );
    }

    currentYAxis = currentYAxis + 40;

    // PROFILE Qualifications
    let qDim;
    if (options.qualification) {
      doc.setFontSize(16);
      doc.text(fifthCol, currentYAxis, 'Qualifications & background');
      currentYAxis = currentYAxis + 20;

      doc.setFontSize(12);
      let qualification = doc.splitTextToSize(
        options.qualification,
        profileBody
      );
      // Adjust yAxis based on text height
      qDim = doc.getTextDimensions(qualification);
      let margins = {
        top: 70,
        bottom: 40,
        left: 30,
        width: 550
      };

      doc.fromHTML(options.qualification, fifthCol, currentYAxis, {
        // y coord
        width: profileBody // max width of content on PDF
      });

      // doc.text(fifthCol, currentYAxis, qualification)
      currentYAxis = currentYAxis + 30;
    }

    // PROFILE Activities
    if (options.currentRole) {
      doc.setFontSize(16);
      doc.text(fifthCol, qDim.h + currentYAxis, 'Activities and current role');
      currentYAxis = currentYAxis + 20;

      doc.setFontSize(12);
      let currentRole = doc.splitTextToSize(options.currentRole, profileBody);
      // Adjust yAxis based on text height
      let cDim = doc.getTextDimensions(currentRole);
      currentYAxis = qDim.h + currentYAxis;

      doc.text(fifthCol, currentYAxis, currentRole);
    }

    doc.setFontSize(9);
    doc.text(
      marginleft,
      pdfHeight - 20,
      'Profile created on ' + currentDate + ' at ' + currentTime
    );

    // Save the Data
    let jobTitleUnderscored = options.jobTitle.split(' ').join('_');
    doc.save(jobTitleUnderscored.toLowerCase() + '.pdf');
  }
}

export default ProfileService;
