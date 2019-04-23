import React from 'react';

import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

import FrameworkButtons from '../components/framework-buttons/FrameworkButtons';

import { apiUrl } from '../services/competency/competency';

class Frameworks extends React.Component {
  state = {
    frameworks: []
  };
  competencyService = new CompetencyService();
  activeRequests = new ActiveRequestsService();
  constructor(props) {
    super(props);
  }

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
          Introduction to the idea of competency frameworks and their linkage
          with training resources. Two lines of description should look good and
          then links can be given to <a className="readmore">read more</a>
        </p>

        <FrameworkButtons frameworks={frameworks} />
      </div>
    );
  }
}

export default Frameworks;
