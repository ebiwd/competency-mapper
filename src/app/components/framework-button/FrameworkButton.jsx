import React from 'react';

import { removeHtmlTags } from '../../services/util/util';

import { Link } from 'react-router-dom';

function FrameworkButton({ framework }) {
  let description = removeHtmlTags(framework.description);
  if (description.length > 120) {
    description = `${description.slice(0, 120).trim()}...`;
  }
  const liveVersion = framework.versions.reduce((prevVersion, newVersion) => {
    if (newVersion.status === 'live') {
      return newVersion.number;
    }
    return prevVersion;
  }, null);

  if (liveVersion === null) {
    return null;
  }

  return (
    <div className="column medium-4">
      <Link
        className="column callout"
        data-equalizer-watch
        to={`/framework/${framework.title.toLowerCase()}/${liveVersion}`}
      >
        <img
          className="float-center margin-bottom-medium"
          style={{ height: '6rem' }}
          src={framework.logo[0].url}
          alt="competency logo"
        />
        <h5>
          {description}
          <i className="icon icon-functional" data-icon=">" />
        </h5>
      </Link>
    </div>
  );
}

export default FrameworkButton;
