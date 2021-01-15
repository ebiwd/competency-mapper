import React from 'react';

export const ProfilePrint = () => {
  return (
    <button className="button" type="button" onClick={() => window.print()}>
      Print / Download <i className="icon icon-common icon-download" />
    </button>
  );
};

export default ProfilePrint;
