import React from 'react';

import { Link } from 'react-router-dom';
import { Version } from '../../../models/version';

type Props = {
  versions: Version[];
  framework: string;
};

export const FrameworkVersion: React.FC<Props> = ({ versions, framework }) => {
  const versionItems = versions
    .filter(version => version.number !== 'draft')
    .map(version => (
      <li key={version.id}>
        <Link to={`/framework/${framework}/${version.number}`}>
          {version.number}
        </Link>{' '}
        {/* TODO: release notes */}
        <Link to={`/release-notes/${framework}/${version.number}`}>
          (release notes)
        </Link>
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
