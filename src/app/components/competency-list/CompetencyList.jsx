import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import { Link } from 'react-router-dom';

import { groupBy } from 'lodash-es';
import './CompetencyList.css';

function CompetencyList({ index, framework, competency, disable }) {
  const attributesGrouped = groupBy(competency.attributes, 'type');
  const attributesTypes = Object.keys(attributesGrouped);
  const attributes = attributesTypes.map(type => {
    const attributes = attributesGrouped[type].map(attribute => (
      <li key={attribute.id}>{attribute.title}</li>
    ));
    return (
      <div key={type}>
        <em>{type}</em>
        <ul>{attributes}</ul>
      </div>
    );
  });

  if (competency.archived === '1') {
    return null;
  }

  return (
    <tr>
      <td>
        <Collapsible
          trigger={
            <div className="open-close-title">
              <span>{competency.title}</span>
              <span className="icon icon-common icon-plus float-right">
                <p className="show-for-sr">show more</p>
              </span>
            </div>
          }
          triggerWhenOpen={
            <div className="open-close-title">
              <span>{competency.title}</span>
              <span className="icon icon-common icon-minus float-right">
                <p className="show-for-sr">show less</p>
              </span>
            </div>
          }
        >
          <div className="padding-left-large padding-top-large">
            <Link to={`${framework}/competency/details/${competency.id}`}>
              <span className="float-right">
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
