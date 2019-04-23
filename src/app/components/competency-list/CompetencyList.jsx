import React from 'react';
import PropTypes from 'prop-types';

import { groupBy } from 'lodash-es';
// import styles from './CompetencyList.css';

// TODO: add collapsible content.

function CompetencyList({ parentIndex, index, competency, disable }) {
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

  return (
    <tr>
      <td>{`${parentIndex + 1}.${index + 1}`}</td>
      <td>
        {competency.title}
        {attributesTypes.length > 0 && (
          <div className="padding-left-large padding-top-large">
            {attributes}{' '}
          </div>
        )}
      </td>
    </tr>
  );
}

CompetencyList.defaultProps = {
  parentIndex: 0,
  index: 0,
  competency: { title: '', competencies: [] },
  disable: true
};

CompetencyList.propTypes = {
  parentIndex: PropTypes.number,
  index: PropTypes.number,
  competency: PropTypes.shape({
    title: PropTypes.string
  }),
  disable: PropTypes.bool
};

export default CompetencyList;
