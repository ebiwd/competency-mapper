import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import ErrorLoading from '../../components/error-loading/ErrorLoading';

import ActiveRequestsService from '../../services/active-requests/active-requests';
import CoursesService from '../../services/courses/courses';
import { safeFlat } from '../../services/util/util';
import Pagination from 'react-js-pagination';

class Courses extends Component {
  static propTypes = {
    framework: PropTypes.string,
    frameworkId: PropTypes.string,
    version: PropTypes.string
  };
  coursesService = new CoursesService();
  activeRequests = new ActiveRequestsService();

  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      filteredCourses: [],
      filter: '',
      filterType: '',
      loadingError: false,
      activePage: 1,
      totalItemsCount: 0,
      noResultsFound: false,
      loading: false
    };
    this.state.framework = props.framework;
    this.state.frameworkId = props.frameworkId;
    this.state.version = props.version;
    this.state.totalItemsCount = 0;
  }

  async handlePageChange(pageNumber) {
    await this.setState({ courses: null });
    await this.setState({ activePage: pageNumber });
    await this.fetchData();
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 700);
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      loading: true
    });
    try {
      this.activeRequests.startRequest();
      let frameworkName = '';
      switch (this.props.framework) {
        case 'bioexcel':
          frameworkName = 'BioExcel';
          break;
        case 'corbel':
          frameworkName = 'CORBEL';
          break;
        case 'ritrain':
          frameworkName = 'RITrain';
          break;
        case 'iscb':
          frameworkName = 'ISCB';
          break;
        case 'nhs':
          frameworkName = 'NHS';
          break;
        case 'cineca':
          frameworkName = 'CINECA';
          break;
        case 'datasteward':
          frameworkName = 'Data Steward';
          break;
        case 'permedcoe':
          frameworkName = 'PerMedCoE';
          break;
      }
      const allCourses = await this.coursesService.getByFramework(
        this.state.activePage,
        this.state.filter,
        this.state.filterType,
        frameworkName
      );
      const courses = this.filterCourses(allCourses);
      this.showAllTrainingResources = this.showAllTrainingResources.bind(this);
      this.setState({ courses, filteredCourses: courses });
      if (courses.length > 0) {
        this.setState({
          totalItemsCount: courses[0].hitcount
        });
      } else {
        this.setState({
          noResultsFound: true
        });
      }
      this.setState({
        totalItemsCount: courses.length > 0 ? courses[0].hitcount : 0
      });
      this.setState({
        loading: false
      });
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async showAllTrainingResources() {
    await this.setState({ filter: '' });
    await this.setState({ activePage: 1 });
    await this.setState({ filterType: '' });
    await this.fetchData().then(() => {
      this.setState({
        noResultsFound: false
      });
    });
  }

  async searchSubmit(e) {
    e.preventDefault();
    //await this.setState({ resources: null });
    await this.setState({ activePage: 0 });
    await this.fetchData();
  }

  filterCourses(allCourses) {
    const { framework } = this.state;
    const { version } = this.state;
    const filteredCourses = [];
    allCourses.forEach(course => {
      if (course.archived === 'archived') {
        return;
      }

      const filteredProfiles = course.competency_profile.filter(
        profile => (profile.framework_label || '').toLowerCase() === framework
      );

      if (filteredProfiles.length === 0) {
        return;
      }

      const modifiedCourse = {
        ...course,
        competencies: safeFlat(
          filteredProfiles.map(
            profile =>
              // safeFlat(
              //   profile.domains.map(domain =>
              //     domain.competencies.map(competency => ({
              //       ...competency,
              //       domain: domain.title
              //     }))
              //   )
              // )
              profile
          )
        )
      };
      filteredCourses.push(modifiedCourse);
    });
    return filteredCourses;
  }

  onFilter = filter => {
    const { courses } = this.state;
    let term;
    try {
      term = new RegExp(filter, 'i');
    } catch (e) {
      term = /./;
    }
    const filteredCourses = courses.filter(course => term.test(course.title));
    this.setState({ filteredCourses, filter });
  };

  async filter(e) {
    await this.setState({ filter: e.target.value });
  }

  async filterTypeHandle(e) {
    await this.setState({ filterType: e.target.value });
  }

  render() {
    const {
      filteredCourses,
      framework,
      filter,
      loadingError,
      version
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    //let unique = [...new Set(course.competencies.map(item => item.id))];

    let duplicates = [];

    const competencyList = competencies =>
      competencies
        .filter(
          (competency, index, all) =>
            all.findIndex(c => c.competency_id === competency.competency_id) ===
            index
        )
        .map(competency => (
          <li key={competency.id}>
            <Link
              to={`/framework/${framework}/${version}/competency/details/${
                competency.competency_id
              }`}
            >
              {competency.competency_label}
            </Link>
          </li>
        ));

    const resources = filteredCourses.map((course, index) => (
      <tr key={course.id}>
        <td>
          {index +
            1 +
            (this.state.activePage ? (this.state.activePage - 1) * 15 : 0)}{' '}
        </td>
        <td>
          <Link to={`/training-resources/${course.id}`}>{course.title}</Link>
        </td>
        <td>{course.type}</td>
        <td>
          <ul>{competencyList(course.competencies)} </ul>
        </td>
      </tr>
    ));

    // function getSerialNo(activePage, itemIndex) {
    //     // activePage += itemIndex;
    //     if (activePage == 0) {
    //         return activePage;
    //     } else {
    //         return activePage + 15;
    //     }
    //
    // }

    return (
      <>
        {this.state.loading ? (
          <div>
            <div className="vf-u-margin__top--200" />
            <span>Fetching data...</span>
            <img
              alt="progress"
              style={{ width: '7%' }}
              src="/progressbar.gif"
            />
          </div>
        ) : (
          <>
            {this.state.noResultsFound ? (
              <>
                <p className="vf-text-body vf-text-body--2">No results found</p>
                <button
                  className="vf-button vf-button--primary vf-button--sm "
                  onClick={this.showAllTrainingResources}
                >
                  Show all training resources
                </button>
              </>
            ) : (
              <div>
                <form
                  className="vf-form | vf-search"
                  onSubmit={e => this.searchSubmit(e)}
                >
                  <div className="vf-grid vf-grid__col-4">
                    <div className="vf-form__item | vf-search__item vf-grid__col--span-2">
                      <input
                        type="search"
                        onChange={this.filter.bind(this)}
                        placeholder="Type to search"
                        className="vf-form__input | vf-search__item"
                      />
                    </div>
                    <div className="vf-form__item vf-grid__col--span-1">
                      <select
                        ref={'type'}
                        onChange={this.filterTypeHandle.bind(this)}
                        className="vf-form__select"
                      >
                        <option value={'All'}>All</option>
                        <option value={'Online'}>Online</option>
                        <option value={'Face-to-Face'}>Face-to-Face</option>
                        <option value={'Webinar'}>Webinar</option>
                        <option value={'Hackathon'}>Hackathon</option>
                      </select>
                    </div>
                    <div className="vf-form__item vf-grid__col--span-1">
                      <input
                        type="submit"
                        className="vf-search__button | vf-button vf-button--primary vf-button--sm"
                        value="Search"
                      />
                    </div>
                  </div>
                </form>
                <table>
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Training resource(s)</th>
                      <th>Type</th>
                      <th>Competencies</th>
                    </tr>
                  </thead>
                  <tbody>{resources}</tbody>
                </table>
                <nav className="vf-pagination" aria-label="Pagination">
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={15}
                    totalItemsCount={this.state.totalItemsCount}
                    pageRangeDisplayed={10}
                    onChange={e => this.handlePageChange(e)}
                    innerClass="vf-pagination__list"
                    itemClass="vf-pagination__item"
                    itemClassPrev="vf-pagination__item--previous-page"
                    itemClassNext="vf-pagination__item--next-page"
                    linkClass="vf-pagination__link vf-pagination__label"
                    activeClass="vf-pagination__item--is-active"
                    prevPageText="Previous"
                    nextPageText="Next"
                  />
                </nav>
              </div>
            )}
          </>
        )}
      </>
    );
  }
}

export default Courses;
