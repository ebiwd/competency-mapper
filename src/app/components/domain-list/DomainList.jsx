import React from 'react';
import PropTypes from 'prop-types';

import CompetencyList from '../competency-list/CompetencyList';

function DomainList({ index, framework, domain, disable }) {
  const competencies = domain.competencies.map((competency, childIndex) => (
    <CompetencyList
      key={competency.id}
      index={childIndex}
      framework={framework}
      competency={competency}
      disable={disable}
    />
  ));

  return (
    <tbody>
      <tr className="white-color secondary-background">
        <td>
          <h4> {domain.title}</h4>
        </td>
      </tr>
      {competencies}
    </tbody>
  );
}

DomainList.defaultProps = {
  domain: { title: '', competencies: [] },
  disable: true
};

DomainList.propTypes = {
  framework: PropTypes.string,
  domain: PropTypes.shape({
    title: PropTypes.string,
    competencies: PropTypes.array
  }),
  disable: PropTypes.bool
};

export default DomainList;
