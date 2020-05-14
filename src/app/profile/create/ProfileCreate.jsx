import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CompetencyService from '../../services/competency/competency';

import ProfileCreateForm from './ProfileCreateForm';

import ProfileService from '../../services/profile/profile';
import ActiveRequestsService from '../../services/active-requests/active-requests';

const activeRequests = new ActiveRequestsService();
const competencyService = new CompetencyService();
const profileService = new ProfileService();

export const ProfileCreate = () => {
  const { framework: frameworkName, version, profileId } = useParams();
  const history = useHistory();

  const [framework, setFramework] = useState();
  const [versionID, setVersionID] = useState();
  const [profile, setProfile] = useState();
  const [pictureId, setPictureId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [framework, moreData, profile] = await Promise.all([
        competencyService.getVersionedFramework(frameworkName, version),
        competencyService.getAllVersionedFrameworks(),
        profileId
          ? profileService.getProfile(profileId, frameworkName, version)
          : Promise.resolve(undefined)
      ]);
      setFramework(framework);
      setVersionID(moreData[0].versions.find(ver => ver.status === 'live')?.id);
      setProfile(profile);
      setPictureId(
        profile?.field_image[0] ? profile?.field_image[0].target_id : null
      );
    };

    try {
      activeRequests.startRequest();
      fetchData();
    } finally {
      activeRequests.finishRequest();
    }
  }, [frameworkName, version, profileId]);

  const handleSubmit = async ({ uploads, ...data }) => {
    const { nid: frameworkId, uuid: frameworkUuid } = framework[0];
    const file = uploads?.[0];

    let fileid = pictureId;
    if (file) {
      const uploadResponse = await profileService.uploadProfilePicture(file);
      fileid = uploadResponse.fid[0].value;
    }

    let response;
    if (profileId) {
      // update profile
      response = await profileService.editProfile(profileId, fileid, ...data);
    } else {
      // create profile
      response = await profileService.createProfile({
        frameworkId,
        frameworkUuid,
        versionID,
        fileid,
        ...data
      });
    }

    history.push(`./map/${response.nid[0].value}`);
  };

  const clearPicture = () => {
    setPictureId(null);
  };

  return (
    <>
      <h2>Create a reference profile</h2>

      <ProfileCreateForm
        profile={profile}
        onSubmit={handleSubmit}
        clearPicture={clearPicture}
      />
    </>
  );
};

export default ProfileCreate;
