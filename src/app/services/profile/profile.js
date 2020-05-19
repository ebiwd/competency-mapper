import HttpService from '../http/http';
import Body from './body';

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

  // TODO: all the 'Guest' functions should take an additional parameter for the framework version.
  // The profile should be stored in an object for (1) storing several versions simultaneously and (2) fast retrieval
  hasGuestProfile() {
    return !!window.localStorage.getItem(profileName);
  }

  getGuestProfile() {
    return JSON.parse(window.localStorage.getItem(profileName));
  }

  editGuestProfile(obj) {
    window.localStorage.setItem(profileName, JSON.stringify(obj));
  }

  mapGuestProfile(options) {
    localStorage.setItem(profileName, JSON.stringify(options));
  }

  async uploadProfilePicture(file) {
    const response = await this.http.post(
      '/file/upload/node/profile/field_image?_format=hal_json',
      file,
      'octet-stream'
    );
  }

  async createProfile(options) {
    const response = await this.http.post(
      '/node?_format=hal_json',
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
      '/api/profiles?_format=json',
      Body.mapProfile(profileId, mapping),
      'json'
    );
    return response.data;
  }

  async getProfile(profileId, framework, version) {
    const response = await this.http.get(
      `/api/${framework}/${version}/profiles?_format=json&id=${profileId}&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async getProfiles(framework, version) {
    const response = await this.http.get(
      `/api/${framework}/${version}/profiles/?_format=json&timestamp=${Date.now()}`
    );
    return response.data;
  }
}

export default ProfileService;
