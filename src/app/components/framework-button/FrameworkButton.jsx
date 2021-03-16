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

  const logoStyles = [
    {
      title: 'bioexcel',
      width: '250px',
      left: '15%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'corbel',
      width: '200px',
      left: '25%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'ritrain',
      width: '150px',
      left: '25%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'iscb',
      width: '200px',
      left: '25%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'nhs',
      width: '300px',
      left: '10%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'cineca',
      width: '250px',
      left: '15%',
      position: 'relative',
      objectFit: 'contain'
    },
    {
      title: 'datasteward',
      width: '340px',
      left: '10%',
      position: 'relative',
      objectFit: 'contain'
    }
  ];
  return (
    <article className="vf-card vf-card--primary">
      <img
        alt="tile"
        className="vf-card__image"
        src={`https://acxngcvroo.cloudimg.io/v7/${framework.logo[0].url}?w=600`}
        style={logoStyles.find(
          el => el.title === framework.title.toLowerCase().replace(/ /g, '')
        )}
      />
      <div className="vf-card__content | vf-stack vf-stack--400">
        <div className="vf-card__title">
          <Link
            className="vf-card__link"
            data-equalizer-watch
            to={`/framework/${framework.title
              .toLowerCase()
              .replace(/ /g, '')}/${liveVersion}`}
          >
            {framework.title}
          </Link>
        </div>

        <div className="vf-card__text">
          {tempDesc.map(item =>
            item.title === framework.title.toLowerCase().replace(/ /g, '')
              ? item.desc
              : ''
          )}
        </div>
      </div>
    </article>
  );
}

export default FrameworkButton;
