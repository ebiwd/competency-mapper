import React from 'react';

import { Link } from 'react-router-dom';

interface Version {
  id: string;
  number: string;
  status: string;
}

type Props = {
  versions: Version[];
};

export const FrameworkVersion: React.FC<Props> = ({ versions }) => {
  const versionItems = versions.map(version => (
    <li key={version.id}>
      <Link to={`/framework/${version.number}`}>{version.number}</Link>{' '}
      {/* TODO: release notes */}
      <Link to={`/release-notes/${version.number}`}>(release notes)</Link>
    </li>
  ));

  return (
    <div className="callout">
      <h5>Framework versions</h5>
      {versions.length === 0 ? 'No previous versions' : <ul>{versionItems}</ul>}
    </div>
  );
};

export default FrameworkVersion;
