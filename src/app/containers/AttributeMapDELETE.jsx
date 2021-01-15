import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';

const $ = window.$;

class AttributeMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>hi</div>;
  }
}

const AttrMap = () => (
  <Switch>
    <Route
      exact
      path="/training-resources/:id/map/:framework"
      component={AttributeMap}
    />
  </Switch>
);

export default AttrMap;
