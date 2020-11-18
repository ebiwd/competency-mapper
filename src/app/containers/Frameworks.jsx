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
          Competency Hub is a web-based tool to support the creation and
          management of competency frameworks{' '}
          <Link to="/about" className="readmore">
            read more{' '}
          </Link>
        </p>

        <FrameworkButtons frameworks={frameworks} />
        <div style={{ padding: '20px' }}>
          <p>
            If you have any questions, comments or suggestions, please contact
            us: competency [at] ebi.ac.uk
          </p>
          <p>
            <Link to="/documentation" className="readmore">
              Developer documentation{' '}
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default withSnackbar(Frameworks);
