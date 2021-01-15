import React, { useEffect } from 'react';

import { Redirect, useParams } from 'react-router-dom';
import ProfileHeader from '../../map/ProfileHeader';
import { ProfilePrint } from '../../view/ProfilePrint';
import ProfileService from '../../../services/profile/profile';
import CompentencyService from '../../../services/competency/competency';

import styles from './ProfileViewGuest.module.css';

const competencyService = new CompentencyService();
const profileService = new ProfileService();

export const ProfileViewGuest = () => {
  const { framework, version } = useParams();
  const profile = profileService.getGuestProfile();

  useEffect(() => {
    competencyService.getVersionedFramework(framework, version);
  }, [framework, version]);

  if (!profile) {
    return <Redirect to="../edit/guest" />;
  }

  return (
    <>
      <div>
        <h2 className={styles.mainTitle}>
          {`${profile.title} - ${profile.job_title}`}
        </h2>
      </div>

      <ProfileHeader {...profile} />

      <div className="submit_fixed">
        <ProfilePrint />
      </div>
    </>
  );
};

export default ProfileViewGuest;
