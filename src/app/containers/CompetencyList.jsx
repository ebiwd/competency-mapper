import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import CompetencyService from '../services/competency/competency';
import Courses from './courses/Courses';
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
    domains: [],
    filter: '',
    filteredDomains: []
  };

  constructor(props) {
    super(props);
    this.state.framework = props.match.params.framework;
  }

  async componentWillMount() {
    this.activeRequests.startRequest();
    const promise1 = this.fetchFramework();
    const promise2 = this.fetchOtherFrameworkDetails();
    await promise1;
    await promise2;
    this.activeRequests.finishRequest();
  }

  componentDidMount() {
    window.scroll(0, 0);
  }

  async fetchFramework() {
    const { framework } = this.state;
    const frameworkData = await this.competencyService.getFramework(framework);
    const domains = safeFlat(frameworkData.map(item => item.domains));
    this.setState({ domains, filteredDomains: domains });
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
      name,
      description,
      filteredDomains,
      framework,
      filter
    } = this.state;

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
        <h3>{name}</h3>
        <p>{description}</p>

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
