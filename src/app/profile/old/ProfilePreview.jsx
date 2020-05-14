import React, { useEffect } from 'react';

import { Redirect } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import { ProfilePrint } from '../view/ProfilePrint';
import ProfileService from '../src/app/services/profile/profile';
import CompentencyService from '../src/app/services/competency/competency';

import styles from './ProfilePreview.module.css';

const competencyService = new CompentencyService();
const profileService = new ProfileService();

export const ProfilePreview = ({ match }) => {
  const { framework, version } = match.params;
  const profile = profileService.getUserProfile();

  useEffect(() => {
    competencyService.getVersionedFramework(framework, version);
  }, [framework, version]);

  if (!profile) {
    return <Redirect to="./create" />;
  }

  return (
    <>
      <div>
        <h2 className={styles.mainTitle}>
          {`${profile.title} - ${profile.jobTitle}`}
        </h2>
      </div>

      <ProfileHeader
        image={profile.selectedFileData}
        current_role={profile.currentRole}
        additional_information={profile.additionalInfo}
        {...profile}
      />

      <div className="submit_fixed">
        <ProfilePrint />
      </div>
    </>
  );
};

export default ProfilePreview;
