import React, { Component } from 'react';

import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

import FrameworkButtons from '../components/framework-buttons/FrameworkButtons';
import { Link } from 'react-router-dom';

class Frameworks extends Component {
  competencyService = new CompetencyService();
  activeRequests = new ActiveRequestsService();

  state = {
    frameworks: []
  };

  async componentDidMount() {
    this.activeRequests.startRequest();
    const frameworks = await this.competencyService.getAllFrameworksDetails();
    this.setState({ frameworks });
    this.activeRequests.finishRequest();
  }

  render() {
    const { frameworks } = this.state;

    return (
      <div className="column">
        <h3>Overview</h3>
        <p className="lead">
          Competency mapper is a web-based tool to support the creation and
          management of competency frameworks for professionals working in the
          biomolecular sciences{' '}
          <Link to="/about" className="readmore">
            read more{' '}
          </Link>
        </p>

        <FrameworkButtons frameworks={frameworks} />
      </div>
    );
  }
}

export default Frameworks;
