import React, { Component, history } from 'react';
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
import CoursesService from '../services/courses/courses';
import { Switch, Route, Link } from 'react-router-dom';

import jsonData from './masterList.json';
import Copyright from './Copyright';
import auth from '../services/util/auth';
import { MetaTags } from 'react-meta-tags';

class CompetencyList extends Component {
  static propTypes = {
    match: PropTypes.shape({
      match: PropTypes.shape({ framework: PropTypes.string })
    })
  };

  competencyService = new CompetencyService();
  activeRequests = new ActiveRequestsService();
  coursesService = new CoursesService();

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
    trainingResourcesExist: false,
    profileCount: 0,
    pathwayCount: 0,
    attributeTypes: [],
    allResourcesFetched: false,
    visibleTabs: [],
    selectedTabIndex: 0,
    pathnames: this.props.history.location.pathname,
    pathnames_count: 0
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

  async setCurrentTab() {
    let visibleTabs = [];
    if (auth.currently_logged_in_user.is_logged_in) {
      visibleTabs.push('career-profiles');
      visibleTabs.push('learning-pathways');
    } else {
      if (this.state.profileCount > 0) {
        visibleTabs.push('career-profiles');
      }
      if (this.state.pathwayCount > 0) {
        visibleTabs.push('learning-pathways');
      }
    }
    visibleTabs.push('competencies');
    if (this.state.trainingResourcesExist) {
      visibleTabs.push('training-resources');
    }
    visibleTabs.push('export');
    await this.setState({ visibleTabs: visibleTabs });
    let currentUrl = window.location.href;
    let selectedTabIndex = 0;
    for (let i = 0; i < this.state.visibleTabs.length; i++) {
      if (currentUrl.includes(this.state.visibleTabs[i])) {
        console.log(this.state.visibleTabs[i]);
        selectedTabIndex = i;
      }
    }
    await this.setState({
      selectedTabIndex: selectedTabIndex
    });
  }

  async componentDidMount() {
    const { framework, version: frameworkVersion } = this.props.match.params;
    this.setState({ pathnames_count: this.state.pathnames.split('/').length });
    window.vfTabs();
    try {
      this.activeRequests.startRequest();
      await Promise.all([
        await this.fetchFramework(framework, frameworkVersion),
        await this.fetchVersions(framework),
        await this.fetchProfiles(),
        await this.fetchPathways(),
        await this.coursesService
          .checkForTrainingResources(1, '', 'All', framework)
          .then(count => {
            if (count > 0) {
              this.setState({
                trainingResourcesExist: true
              });
            }
          })
      ]).then(() => {
        this.setState({
          allResourcesFetched: true
        });
        this.setCurrentTab();
      });
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

  // Removed timestamp
  fetchProfiles() {
    const { framework, frameworkVersion } = this.state;
    fetch(
      `${apiUrl}/api/${framework}/${frameworkVersion}/profiles?_format=json&source=competencyhub`
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

  // Removed timestamp
  fetchPathways() {
    const { framework } = this.state;
    fetch(
      `${apiUrl}/api/${framework}/pathways?_format=json&source=competencyhub`
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
          trainingResourcesExist={this.state.trainingResourcesExist}
        />
      )
    );

    const changeTabURL = e => {
      e.currentTarget.children[0].click();
    };

    return (
      <>
        <MetaTags>
          <title>
            {
              jsonData.filter(item => item.title === this.state.framework)[0]
                .desc
            }
          </title>
          <meta
            property="og:title"
            content={
              jsonData.filter(item => item.title === this.state.framework)[0]
                .desc
            }
          />
          <meta name="description" content={frameworkDescription} />
          <meta
            property="keywords"
            content={`training, competencies, career profiles, ${
              jsonData.filter(item => item.title === this.state.framework)[0]
                .desc
            }`}
          />
        </MetaTags>
        <div className="vf-u-margin__top--400" />
        <h2>
          {' '}
          {
            jsonData.filter(item => item.title === this.state.framework)[0].desc
          }{' '}
        </h2>
        <h3>{frameworkName}</h3>
        <p>
          <span className="vf-badge">{frameworkVersion}</span>
          <span className="vf-badge vf-badge--primary"> {frameworkStatus}</span>
        </p>
        <p>{frameworkDescription}</p>

        {this.state.allResourcesFetched ? (
          <Tabs
            className="vf-tabs ch_tabs__list"
            selectedIndex={this.state.selectedTabIndex}
            onSelect={index =>
              this.setState({
                selectedTabIndex: index
              })
            }
          >
            <TabList className="vf-tabs__list">
              {localStorage.getItem('roles') ? (
                <Tab onClick={e => changeTabURL(e)}>
                  <Link
                    to={`/framework/${framework}/${
                      this.props.match.params.version
                    }/career-profiles`}
                    className="customTabLinks"
                  >
                    Career profiles
                  </Link>
                </Tab>
              ) : this.state.profileCount > 0 ? (
                <Tab onClick={e => changeTabURL(e)}>
                  <Link
                    to={`/framework/${framework}/${
                      this.props.match.params.version
                    }/career-profiles`}
                    className="customTabLinks"
                  >
                    Career profiles
                  </Link>
                </Tab>
              ) : (
                ''
              )}
              {localStorage.getItem('roles') ? (
                <Tab onClick={e => changeTabURL(e)}>
                  <Link
                    to={`/framework/${framework}/${
                      this.props.match.params.version
                    }/learning-pathways`}
                    className="customTabLinks"
                  >
                    Learning pathways
                  </Link>
                </Tab>
              ) : this.state.pathwayCount > 0 ? (
                <Tab onClick={e => changeTabURL(e)}>
                  <Link
                    to={`/framework/${framework}/${
                      this.props.match.params.version
                    }/learning-pathways`}
                    className="customTabLinks"
                  >
                    Learning pathways
                  </Link>
                </Tab>
              ) : (
                ''
              )}

              <Tab onClick={e => changeTabURL(e)}>
                <Link
                  to={`/framework/${framework}/${
                    this.props.match.params.version
                  }/competencies`}
                  className="customTabLinks"
                >
                  Competencies
                </Link>
              </Tab>

              {this.state.trainingResourcesExist ? (
                <Tab onClick={e => changeTabURL(e)}>
                  <Link
                    to={`/framework/${framework}/${
                      this.props.match.params.version
                    }/training-resources`}
                    className="customTabLinks"
                  >
                    Training resources
                  </Link>
                </Tab>
              ) : (
                ''
              )}
              <Tab onClick={e => changeTabURL(e)}>
                <Link
                  to={`/framework/${framework}/${
                    this.props.match.params.version
                  }/export`}
                  className="customTabLinks"
                >
                  Export
                </Link>
              </Tab>
            </TabList>

            {localStorage.getItem('roles') ? (
              <TabPanel>
                <ProfileList framework={framework} version={frameworkVersion} />
                <div className="vf-grid">
                  <div>
                    <FrameworkVersions
                      framework={framework}
                      versions={versions}
                    />
                  </div>
                  <div>
                    <Copyright framework={framework} />
                  </div>
                </div>
              </TabPanel>
            ) : this.state.profileCount > 0 ? (
              <TabPanel>
                <ProfileList framework={framework} version={frameworkVersion} />
                <div className="vf-u-margin__top--1600" />
                <div className="vf-grid">
                  <div>
                    <FrameworkVersions
                      framework={framework}
                      versions={versions}
                    />
                  </div>
                  <div>
                    <Copyright framework={framework} />
                  </div>
                </div>
                <div className="vf-u-margin__top--1600" />
              </TabPanel>
            ) : (
              ''
            )}

            {localStorage.getItem('roles') ? (
              <TabPanel>
                <PathwaysList framework={framework} />
                <FrameworkVersions framework={framework} versions={versions} />
                <div className="vf-u-margin__top--1600" />
              </TabPanel>
            ) : this.state.pathwayCount > 0 ? (
              <TabPanel>
                <PathwaysList framework={framework} />
                <FrameworkVersions framework={framework} versions={versions} />
                <div className="vf-u-margin__top--1600" />
              </TabPanel>
            ) : (
              ''
            )}

            <TabPanel>
              <form
                action="#"
                className="vf-form | vf-search vf-search--inline"
              >
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
              <div className="vf-u-margin__top--800" />
              <div>{domainList}</div>
              <div className="vf-u-margin__top--800" />
              <div className="vf-grid">
                <div>
                  <FrameworkVersions
                    framework={framework}
                    versions={versions}
                  />
                </div>
                <div>
                  <Copyright framework={framework} />
                </div>
              </div>
              <div className="vf-u-margin__top--1600" />
            </TabPanel>

            {this.state.trainingResourcesExist ? (
              <TabPanel>
                <Courses
                  framework={framework}
                  version={frameworkVersion}
                  frameworkId={frameWorkId}
                />
              </TabPanel>
            ) : (
              ''
            )}

            <TabPanel>
              <FAIRDownload />
              <FrameworkVersions framework={framework} versions={versions} />
              <div className="vf-u-margin__top--1200" />
            </TabPanel>
          </Tabs>
        ) : (
          <div>
            <div className="vf-u-margin__top--200" />
            <span>Fetching data...</span>
            <img
              alt="progress"
              style={{ width: '7%' }}
              src="/progressbar.gif"
            />
          </div>
        )}
      </>
    );
  }
}

export default CompetencyList;
