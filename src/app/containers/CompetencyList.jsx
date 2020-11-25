import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ErrorLoading from '../components/error-loading/ErrorLoading';

import DomainList from '../components/domain-list/DomainList';
import Courses from './courses/Courses';
import ProfileList from './ProfileList';
import FrameworkVersions from '../containers/framework-versions/FrameworkVersions';

import CompetencyService from '../services/competency/competency';
import { apiUrl } from '../services/http/http';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat, removeHtmlTags } from '../services/util/util';

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
    frameworkVersion: '',
    frameworkName: '',
    frameworkStatus: '',
    frameworkDescription: '',
    versions: [],
    domains: [],
    filter: '',
    filteredDomains: [],
    loadingError: false,
    profileCount: 0,
    attributeTypes: []
  };

  static getDerivedStateFromProps(props, state) {
    const { framework, version: frameworkVersion } = props.match.params;
    if (
      framework !== state.framework ||
      frameworkVersion !== state.frameworkVersion
    ) {
      return {
        framework,
        frameworkVersion,
        domains: [],
        loadingError: false
      };
    }

    // No state update necessary
    return null;
  }

  async componentDidMount() {
    const { framework, version: frameworkVersion } = this.props.match.params;
    try {
      this.activeRequests.startRequest();
      await Promise.all([
        this.fetchFramework(framework, frameworkVersion),
        this.fetchVersions(framework)
      ]);

      this.fetchProfiles();
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { framework, frameworkVersion, domains, loadingError } = this.state;
    if (
      framework !== prevState.framework ||
      frameworkVersion !== prevState.frameworkVersion
    ) {
      if (domains.length === 0 && !loadingError) {
        try {
          this.activeRequests.startRequest();
          await this.fetchFramework(framework, frameworkVersion);
        } catch (error) {
          this.setState({ loadingError: true });
        } finally {
          this.activeRequests.finishRequest();
        }
      }
      this.fetchProfiles();
    }
  }

  fetchProfiles() {
    const { framework, frameworkVersion } = this.state;
    fetch(
      `${apiUrl}/api/${framework}/${frameworkVersion}/profiles?_format=json&timestamp=${Date.now()}`
    )
      .then(Response => Response.json())
      .then(findResponse => {
        this.setState({
          profileCount: findResponse.filter(
            item => item.publishing_status === 'Live'
          ).length
        });
      });
  }

  async fetchFramework(framework, frameworkVersion) {
    window.scroll(0, 0);
    const frameworkData = await this.competencyService.getVersionedFramework(
      framework,
      frameworkVersion
    );
    const domains = safeFlat(frameworkData.map(item => item.domains));
    const frameworkDescription = removeHtmlTags(frameworkData[0].description);

    this.setState({
      frameworkName: frameworkData[0].title,
      //frameworkStatus: frameworkData[0].status,
      frameworkDescription,
      domains,
      filteredDomains: domains
    });

    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase() === framework
    );
    if (currentFramework.length > 0) {
      const versionStatus = currentFramework[0].versions.filter(
        vr => vr.number === frameworkVersion
      );
      this.setState({ frameworkStatus: versionStatus[0].status });
      let attrTypes = currentFramework[0].attribute_types.map(
        type => type.title
      );
      this.setState({ attributeTypes: attrTypes });
    }
  }

  async fetchVersions(framework) {
    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase() === framework
    );
    if (currentFramework.length > 0) {
      this.setState({ versions: currentFramework[0].versions.reverse() });
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
      framework,
      frameworkVersion,
      frameworkName,
      frameworkStatus,
      frameworkDescription,
      filteredDomains,
      versions,
      filter,
      loadingError,
      attributeTypes
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    const domainList = filteredDomains.map(domain =>
      domain === null ? null : (
        <DomainList
          key={domain.nid}
          framework={framework}
          domain={domain}
          disable={true}
          version={frameworkVersion}
          attributeTypes={attributeTypes}
        />
      )
    );

    return (
      <>
        <h1 style={{ color: '#000000' }}>{frameworkName}</h1>
        {console.log(attributeTypes)}
        <p>
          <span className="tag">{frameworkVersion}</span>
          <span className="tag secondary-background"> {frameworkStatus}</span>
        </p>
        <p>{frameworkDescription}</p>

        <Tabs>
          <TabList>
            {localStorage.getItem('roles') ? (
              <Tab>Career profiles {console.log(this.state.profileCount)} </Tab>
            ) : this.state.profileCount > 0 ? (
              <Tab>Career profiles</Tab>
            ) : (
              ''
            )}

            <Tab>Competencies</Tab>
            <Tab>Training resources</Tab>
          </TabList>

          {localStorage.getItem('roles') ? (
            <TabPanel>
              <ProfileList framework={framework} version={frameworkVersion} />
              <FrameworkVersions framework={framework} versions={versions} />
            </TabPanel>
          ) : this.state.profileCount > 0 ? (
            <TabPanel>
              <ProfileList framework={framework} version={frameworkVersion} />
              <FrameworkVersions framework={framework} versions={versions} />
            </TabPanel>
          ) : (
            ''
          )}

          <TabPanel>
            <input
              // className="clearable" // It doesn't work correctly
              type="search"
              value={filter}
              onChange={event => this.onFilter(event.target.value)}
              placeholder="Filter competencies"
            />
            <table>{domainList}</table>
            <FrameworkVersions framework={framework} versions={versions} />
          </TabPanel>
          <TabPanel>
            <Courses framework={framework} version={frameworkVersion} />
          </TabPanel>
        </Tabs>
      </>
    );
  }
}

export default CompetencyList;
