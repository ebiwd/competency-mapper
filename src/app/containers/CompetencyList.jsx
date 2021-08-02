import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ErrorLoading from '../components/error-loading/ErrorLoading';

import DomainList from '../components/domain-list/DomainList';
import Courses from './courses/Courses';
import ProfileList from './ProfileList';
import PathwaysList from './PathwaysList';
import FrameworkVersions from '../containers/framework-versions/FrameworkVersions';

import CompetencyService from '../services/competency/competency';
import { apiUrl } from '../services/http/http';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat, removeHtmlTags } from '../services/util/util';
import FAIRDownload from '../components/FAIRDownload';

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
    pathwayCount: 0,
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
      this.fetchPathways();
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
      this.fetchPathways();
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

  fetchPathways() {
    const { framework } = this.state;
    fetch(
      `${apiUrl}/api/${framework}/pathways?_format=json&timestamp=${Date.now()}`
    )
      .then(Response => Response.json())
      .then(findResponse => {
        this.setState({
          pathwayCount: findResponse.filter(
            item => item.publishing_status === true
          ).length
          //pathwayCount: findResponse.length
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
      filteredDomains: domains,
      frameWorkId: frameworkData[0].nid
    });

    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase().replace(/ /g, '') === framework
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
      fw => fw.title.toLowerCase().replace(/ /g, '') === framework
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
      frameWorkId,
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
        <p>
          <span className="vf-badge">{frameworkVersion}</span>
          <span className="vf-badge vf-badge--primary"> {frameworkStatus}</span>
        </p>
        <p>{frameworkDescription}</p>

        <Tabs className="vf-tabs ch_tabs__list">
          <TabList className="vf-tabs__list">
            {localStorage.getItem('roles') ? (
              <Tab>Career profiles</Tab>
            ) : this.state.profileCount > 0 ? (
              <Tab>Career profiles</Tab>
            ) : (
              ''
            )}
            {localStorage.getItem('roles') ? (
              <Tab>Learning pathways</Tab>
            ) : this.state.pathwayCount > 0 ? (
              <Tab>Learning pathways</Tab>
            ) : (
              ''
            )}

            {/* <Tab>Learning pathways</Tab> */}
            <Tab>Competencies</Tab>
            <Tab>Training resources</Tab>
            <Tab>Export</Tab>
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

          {localStorage.getItem('roles') ? (
            <TabPanel>
              <PathwaysList framework={framework} />
              <FrameworkVersions framework={framework} versions={versions} />
            </TabPanel>
          ) : this.state.pathwayCount > 0 ? (
            <TabPanel>
              <PathwaysList framework={framework} />
              <FrameworkVersions framework={framework} versions={versions} />
            </TabPanel>
          ) : (
            ''
          )}

          <TabPanel>
            <form action="#" className="vf-form | vf-search vf-search--inline">
              <div className="vf-form__item | vf-search__item">
                <label
                  className="vf-form__label vf-u-sr-only | vf-search__label"
                  htmlFor="inlinesearchitem"
                >
                  Inline search
                </label>
                <input
                  type="search"
                  placeholder="Filter competencies"
                  id="inlinesearchitem"
                  className="vf-form__input | vf-search__input"
                  onChange={event => this.onFilter(event.target.value)}
                  value={filter}
                />
              </div>
            </form>
            <table>{domainList}</table>
            <FrameworkVersions framework={framework} versions={versions} />
          </TabPanel>
          <TabPanel>
            <Courses
              framework={framework}
              version={frameworkVersion}
              frameworkId={frameWorkId}
            />
          </TabPanel>
          <TabPanel>
            <FAIRDownload />
            <FrameworkVersions framework={framework} versions={versions} />
          </TabPanel>
        </Tabs>
      </>
    );
  }
}

export default CompetencyList;
