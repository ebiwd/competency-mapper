import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import CompetencyService from '../../services/competency/competency';

type Props = {
  framework: string;
};

interface Version {
  id: string;
  number: string;
  status: string;
}

const competency = new CompetencyService();

export const FrameworkVersion: React.FC<Props> = ({ framework }) => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    async function fetch() {
      const allFrameworks = await competency.getAllVersionedFrameworks();
      const newFramework = allFrameworks.filter(
        (fw: any) => fw.title.toLowerCase() === framework
      );
      if (newFramework.length > 0) {
        setVersions(newFramework[0].versions.reverse());
      }
    }

    fetch();
  }, [framework]);

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
