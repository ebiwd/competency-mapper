import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat, removeHtmlTags } from '../services/util/util';

import DomainList from '../components/domain-list/DomainList';

// import styles from './CompetencyList.css';

class CompetencyList extends Component {
  static propTypes = {
    match: PropTypes.shape({
      match: PropTypes.shape({ framework: PropTypes.string })
    })
  };

  competencyService = new CompetencyService();
  activeRequests = new ActiveRequestsService();

  state = {
    framework: '',
    name: '',
    description: '',
    domains: []
  };

  constructor(props) {
    super(props);
    this.state.framework = props.match.params.framework;
  }

  async componentDidMount() {
    window.scroll(0, 0);
    this.activeRequests.startRequest();
    const promise1 = this.fetchFramework();
    const promise2 = this.fetchOtherFrameworkDetails();
    await promise1;
    await promise2;
    this.activeRequests.finishRequest();
  }

  async fetchFramework() {
    const { framework } = this.state;
    const frameworkData = await this.competencyService.getFramework(framework);
    const domains = safeFlat(frameworkData.map(item => item.domains));
    this.setState({ domains });
  }

  async fetchOtherFrameworkDetails() {
    const { framework } = this.state;
    const frameworkData = await this.competencyService.getAllFrameworks();
    const frameworkMatch = frameworkData.filter(
      item => item.name.toLowerCase() === framework
    );

    if (frameworkMatch.length) {
      this.setState({
        name: frameworkMatch[0].name,
        description: removeHtmlTags(frameworkMatch[0].description)
      });
    }
  }

  render() {
    const { name, description, domains } = this.state;
    const domainList = domains.map((domain, index) => (
      <DomainList
        key={domain.nid}
        index={index}
        domain={domain}
        disable={true}
      />
    ));
    return (
      <>
        <h3>{name}</h3>
        <p>{description}</p>
        <table>{domainList}</table>
      </>
    );
  }
}

export default CompetencyList;
