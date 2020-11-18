import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import data from './CompetencyHubAPIs.json';

const Documentation = () => {
  return (
    <>
      <h1 style={{ color: '#000' }}>API Documentation</h1>
      <SwaggerUI spec={data} />
    </>
  );
};

export default Documentation;
