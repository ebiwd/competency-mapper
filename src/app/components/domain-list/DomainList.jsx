import React from 'react';
import PropTypes from 'prop-types';

import CompetencyList from '../competency-list/CompetencyList';

function DomainList({
  index,
  framework,
  domain,
  disable,
  version,
  attributeTypes,
  trainingResourcesExist
}) {
  const competencies = domain.competencies.map((competency, childIndex) => (
    <CompetencyList
      key={competency.id}
      index={childIndex}
      framework={framework}
      competency={competency}
      disable={disable}
      version={version}
      attributeTypes={attributeTypes}
      trainingResourcesExist={trainingResourcesExist}
    />
  ));

  return (
    <>
      <h2> {domain.title}</h2>
      {competencies}
    </>
  );
}

DomainList.defaultProps = {
  domain: { title: '', competencies: [] },
  disable: true,
  trainingResourcesExist: false
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
