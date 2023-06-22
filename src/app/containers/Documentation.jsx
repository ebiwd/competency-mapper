import React, { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import data from './CompetencyHubAPIs.json';

const Documentation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <h1 style={{ color: '#000' }}>API Documentation</h1>
      <h3>Our API documenation is based on Open API specifications 2.0.</h3>
      <SwaggerUI spec={data} />
    </>
  );
};

export default Documentation;
