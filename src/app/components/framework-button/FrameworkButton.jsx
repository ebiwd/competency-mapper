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

  const tempDesc = [
    {
      title: 'bioexcel',
      desc: 'Professionals in computational biomolecular research'
    },
    {
      title: 'corbel',
      desc: 'Technical operators of biomedical research infrastructures'
    },
    { title: 'ritrain', desc: 'Managers of research infrastructures' },
    {
      title: 'iscb',
      desc: 'Students and professionals in computational biology'
    },
    {
      title: 'cineca',
      desc: 'Professionals working with human data for disease research'
    },
    {
      title: 'nhs',
      desc:
        'Clinical practitioners for the application of genomics in the healthcare service'
    },
    {
      title: 'datasteward',
      desc: 'Data steward roles: policy, research and infrastructure'
    }
  ];

  return (
    <div className="column medium-4">
      <Link
        className="column callout"
        data-equalizer-watch
        to={`/framework/${framework.title
          .toLowerCase()
          .replace(/ /g, '')}/${liveVersion}`}
      >
        <img
          className="float-center margin-bottom-medium"
          style={{ height: '6rem' }}
          src={framework.logo[0].url}
          alt="competency logo"
        />
        <h5>
          {/* {description} */}
          {tempDesc.map(item =>
            item.title === framework.title.toLowerCase().replace(/ /g, '')
              ? item.desc
              : ''
          )}
          {/* <i className="icon icon-functional" data-icon=">" /> */}
        </h5>
      </Link>
    </div>
  );
}

export default FrameworkButton;
