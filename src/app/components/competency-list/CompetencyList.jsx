import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import { Link } from 'react-router-dom';

import { groupBy } from 'lodash-es';
import './CompetencyList.css';

function CompetencyList({
  index,
  framework,
  competency,
  disable,
  version,
  attributeTypes
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

  const slugify = string => {
    return string
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  if (competency.archived === '1') {
    return null;
  }

  return (
    <tr>
      <td>
        <Collapsible
          trigger={
            <div className="open-close-title">
              <span className="icon icon-common icon-angle-right float-left icon-custom" />
              <span>{competency.title}</span>
            </div>
          }
          triggerWhenOpen={
            <div className="open-close-title">
              <span className="icon icon-common icon-angle-down float-left icon-custom" />
              <span>{competency.title}</span>
            </div>
          }
        >
          <div>
            <Link
              to={`/framework/${framework}/${version}/competency/details/${
                competency.id
              }`}
            >
              <span style={{ float: 'right' }}>
                <i className="icon icon-spacer icon-common icon-info" />
                More details
              </span>
            </Link>
            {attributes}
          </div>
        </Collapsible>
      </td>
    </tr>
  );
}

CompetencyList.defaultProps = {
  parentIndex: 0,
  index: 0,
  disable: true
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
