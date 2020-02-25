import HttpService from '../http/http';
import Body from './body';

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
}

export default ProfileService;
