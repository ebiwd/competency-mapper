import React from 'react';

import Parser from 'html-react-parser';
import user_icon from '../../../assets/user_icon.png';
import styles from './ProfileHeader.module.css';

type Props = {
  image?: Array<{ src?: string; url?: string }>;
  age?: string;
  gender?: string;
  qualification_background?: string;
  current_role?: string;
  additional_information?: string;
};
export const ProfileHeader = ({
  image,
  gender,
  age,
  qualification_background,
  current_role,
  additional_information,
}: Props) => {
  const photo = image?.[0];

  return (
    <div className="row">
      <div className="column large-4 text-center">
        {photo && (
          <img
            className={styles.picture}
            src={photo?.src ?? photo?.url ?? user_icon}
            alt="Your profile"
          />
        )}
        <br />
        <p>
          {gender}
          {age && gender ? ` | ` : ''}
          {age && `${age} years`}
        </p>
      </div>

      <div className="column large-8">
        {qualification_background && (
          <>
            <h3>Qualification and background</h3>
            <p>{Parser(qualification_background)}</p>
          </>
        )}

        {current_role && (
          <>
            <h3>Activities of current role</h3>
            <p>{Parser(current_role)}</p>
          </>
        )}

        {additional_information && (
          <>
            <h3>Additional information</h3>
            <p>{Parser(additional_information)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
