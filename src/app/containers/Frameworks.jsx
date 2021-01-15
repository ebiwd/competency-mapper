import React, { Component } from 'react';

import FrameworkButtons from '../components/framework-buttons/FrameworkButtons';
import { Link } from 'react-router-dom';

import { withSnackbar } from 'notistack';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

class Frameworks extends Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  state = {
    frameworks: []
  };

  async componentDidMount() {
    try {
      this.activeRequests.startRequest();
      const frameworks = await this.competencyService.getAllVersionedFrameworks();
      this.setState({ frameworks });
    } catch (error) {
      this.props.enqueueSnackbar('Unable to fetch framework data', {
        variant: 'error'
      });
      console.error(error);
    } finally {
      this.activeRequests.finishRequest();
    }
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

export default withSnackbar(Frameworks);
