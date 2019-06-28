import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ErrorLoading from '../components/error-loading/ErrorLoading';

import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat, removeHtmlTags } from '../services/util/util';

import DomainList from '../components/domain-list/DomainList';
import Courses from './courses/Courses';

class CompetencyList extends Component {
  static propTypes = {
    match: PropTypes.shape({
      match: PropTypes.shape({ framework: PropTypes.string })
    })
  };

  competencyService = new CompetencyService();
  activeRequests = new ActiveRequestsService();

  state = {
    framework: this.props.match.params.framework,
    frameworkVersion: this.props.match.params.version,
    frameworkName: '',
    frameworkStatus: '',
    frameworkDescription: '',
    domains: [],
    filter: '',
    filteredDomains: [],
    loadingError: false
  };

  async componentDidMount() {
    window.scroll(0, 0);

    try {
      this.activeRequests.startRequest();
      await this.fetchFramework();
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async fetchFramework() {
    const { framework, frameworkVersion } = this.state;
    const frameworkData = await this.competencyService.getVersionedFramework(
      framework,
      frameworkVersion
    );
    const domains = safeFlat(frameworkData.map(item => item.domains));
    this.setState({
      frameworkVersion: frameworkData[0].version,
      frameworkName: frameworkData[0].title,
      frameworkStatus: frameworkData[0].status,
      frameworkDescription: removeHtmlTags(frameworkData[0].description),
      domains,
      filteredDomains: domains
    });
  }

  onFilter = filter => {
    const { domains } = this.state;
    let term;
    try {
      term = new RegExp(filter, 'i');
    } catch (e) {
      term = /./;
    }
    const filteredDomains = domains.map(domain => {
      const filteredCompetencies = domain.competencies.filter(competency =>
        term.test(competency.title)
      );
      if (filteredCompetencies.length === 0) {
        return null;
      }
      return { ...domain, competencies: filteredCompetencies };
    });
    this.setState({ filter, filteredDomains });
  };

  render() {
    const {
      frameworkName,
      frameworkVersion,
      frameworkStatus,
      frameworkDescription,
      filteredDomains,
      framework,
      filter,
      loadingError
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    const domainList = filteredDomains.map((domain, index) =>
      domain === null ? null : (
        <DomainList
          key={domain.nid}
          index={index}
          framework={framework}
          domain={domain}
          disable={true}
        />
      )
    );

    return (
      <>
        <h3>{frameworkName}</h3>
        <p>
          <span className="tag">{frameworkVersion}</span>
          <span className="tag secondary-background">{frameworkStatus}</span>
        </p>
        <p>{frameworkDescription}</p>

        <Tabs>
          <TabList>
            <Tab>Competencies</Tab>
            <Tab>Training resources</Tab>
          </TabList>

          <TabPanel>
            <input
              // className="clearable" // It doesn't work correctly
              type="search"
              value={filter}
              onChange={event => this.onFilter(event.target.value)}
              placeholder="Filter competencies"
            />
            <table>{domainList}</table>
          </TabPanel>
          <TabPanel>
            <Courses framework={framework} />
          </TabPanel>
        </Tabs>
      </>
    );
  }
}

export default CompetencyList;
