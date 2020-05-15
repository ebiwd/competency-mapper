import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import ProfileService from '../../services/profile/profile';

import ProfileCreateForm from './ProfileEditForm';

const profileService = new ProfileService();

export const ProfileEditGuest = () => {
  const profile = profileService.getGuestProfile();
  const history = useHistory();
  const [clearPicture, setClearPicture] = useState(false);

  // Convert image file to base64 string: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
  const convertToBase64 = (file, data) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      function () {
        const image = [{ src: reader.result }];
        save({ image, ...data });
      },
      false
    );
    reader.readAsDataURL(file);
  };

  const handleSubmit = ({ uploads, ...data }) => {
    const file = uploads?.[0];

    if (file) {
      convertToBase64(file, data);
      return;
    }
    save(data);
  };

  const save = (data) => {
    // TODO:
    //  1. add uuid for the framework version
    //  2. logo for the framework? (I don't recommend it)
    let { image, ...restProfile } = profile;
    if (clearPicture) {
      image = undefined;
    }
    profileService.editGuestProfile({
      mapping: [],
      mappingAttributes: [],
      image,
      ...restProfile,
      ...data,
    });
    history.push('../map/guest');
  };

  return (
    <>
      <h2>Create your profile</h2>

      <ProfileCreateForm
        profile={profile}
        onSubmit={handleSubmit}
        clearPicture={() => setClearPicture(true)}
      />
    </>
  );
};

export default ProfileEditGuest;
