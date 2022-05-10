import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {vfTabs} from "@visual-framework/vf-tabs";
import { vfTabs } from '@visual-framework/vf-tabs/vf-tabs.js';

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
import ProfilePanel from './competency-nested-components/ProfilePanel';
import { Switch, Route, Link } from 'react-router-dom';

class VFTabsCompetencyList extends Component {
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
    selectedTabIndex: 0
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
    if (localStorage.getItem('roles') || this.state.profileCount > 0) {
      visibleTabs.push('career-profiles');
    }
    if (localStorage.getItem('roles') || this.state.pathwayCount > 0) {
      visibleTabs.push('learning-pathways');
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
        selectedTabIndex = i;
      }
    }
    this.setState({
      selectedTabIndex: selectedTabIndex
    });
  }

  async componentDidMount() {
    const { framework, version: frameworkVersion } = this.props.match.params;
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
    // vfTabs();
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

    return (
      <>
        <h1 style={{ color: '#000000' }}>{frameworkName}</h1>
        <p>
          <span className="vf-badge">{frameworkVersion}</span>
          <span className="vf-badge vf-badge--primary"> {frameworkStatus}</span>
        </p>
        <p>{frameworkDescription}</p>

        {this.state.allResourcesFetched ? (
          <div>
            <div className="vf-tabs">
              <ul className="vf-tabs__list" data-vf-js-tabs>
                {localStorage.getItem('roles') ? (
                  <li className="vf-tabs__item">
                    <a className="vf-tabs__link" href="#career-profiles">
                      Section
                    </a>
                  </li>
                ) : this.state.profileCount > 0 ? (
                  <li className="vf-tabs__item">
                    <a className="vf-tabs__link" href="#career-profiles">
                      Section
                    </a>
                  </li>
                ) : (
                  ''
                )}
                <li className="vf-tabs__item">
                  <a className="vf-tabs__link" href="#vf-tabs__section--2">
                    A Short Section
                  </a>
                </li>
                <li className="vf-tabs__item">
                  <a className="vf-tabs__link" href="#vf-tabs__section--3">
                    A 3rd Section
                  </a>
                </li>
              </ul>
            </div>

            <div className="vf-tabs-content" data-vf-js-tabs-content>
              <section className="vf-tabs__section" id="career-profiles">
                <h2>Section 1</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                  euismod, tortor nec pharetra ultricies, ante erat imperdiet
                  velit, nec laoreet enim lacus a velit.{' '}
                  <a className="vf-link" href="#">
                    Nam luctus
                  </a>
                  , enim in interdum condimentum, nisl diam iaculis lorem, vel
                  volutpat mi leo sit amet lectus. Praesent non odio bibendum
                  magna bibendum accumsan.
                </p>
              </section>
              <section className="vf-tabs__section" id="vf-tabs__section--2">
                <h2>Section 2</h2>
                <p>
                  Nullam at diam nec arcu suscipit auctor non a erat. Sed et
                  magna semper, eleifend magna non, facilisis nisl. Proin et est
                  et lorem dictum finibus ut nec turpis. Aenean nisi tortor,
                  euismod a mauris a, mattis scelerisque tortor. Sed dolor
                  risus, varius a nibh id, condimentum lacinia est. In lacinia
                  cursus odio a aliquam. Curabitur tortor magna, laoreet ut
                  rhoncus at, sodales consequat tellus.
                </p>
              </section>
              <section className="vf-tabs__section" id="vf-tabs__section--3">
                <h2>Section 3</h2>
                <p>3rd section</p>
              </section>
            </div>
          </div>
        ) : (
          <div>
            <div className="vf-u-margin__top--200" />
            <span>Fetching data...</span>
            <img
              alt="progress"
              style={{ width: '7%' }}
              src="/dev-competency-mapper/progressbar.gif"
            />
          </div>
        )}
      </>
    );
  }
}

export default VFTabsCompetencyList;
