import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { groupBy } from 'lodash-es';
import './CompetencyList.css';

function CompetencyList({
  index,
  framework,
  competency,
  disable,
  version,
  attributeTypes,
  trainingResourcesExist
}) {
  const attributesGrouped = groupBy(competency.attributes, 'type');
  const attrTypes = attributeTypes;
  const attributes = attrTypes.map(type => {
    const attributes = attributesGrouped[type]
      ? attributesGrouped[type].map(attribute => (
          <li className="vf-list__item" key={attribute.id}>
            {attribute.title}
          </li>
        ))
      : '';
    return attributes ? (
      <div key={type} className="attribute_type">
        <em>{type}</em>
        <ul className="vf-list--unordered" style={{ paddingLeft: '24px' }}>
          {attributes}
        </ul>
      </div>
    ) : (
      ''
    );
  });

  if (competency.archived === '1') {
    return null;
  }

  return (
    <details className="vf-details" close>
      <summary className="vf-details--summary">{competency.title}</summary>
      {attributes}
      <div>
        <Link
          to={`/framework/${framework}/${version}/competency/details/${
            competency.id
          }?scroll=true`}
        >
          <span>
            <i className="icon icon-spacer icon-common icon-info" />
            {trainingResourcesExist
              ? 'View training resources associated with this competency'
              : 'View more information about this competency'}
          </span>
        </Link>
      </div>
    </details>
  );
}

CompetencyList.defaultProps = {
  parentIndex: 0,
  index: 0,
  disable: true,
  trainingResourcesExist: false
};

CompetencyList.propTypes = {
  parentIndex: PropTypes.number,
  index: PropTypes.number,
  framework: PropTypes.string,
  competency: PropTypes.shape({
    title: PropTypes.string
  }),
  disable: PropTypes.bool
};

export default CompetencyList;
