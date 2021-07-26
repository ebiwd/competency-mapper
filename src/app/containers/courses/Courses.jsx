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
    version: PropTypes.string
  };

  state = {
    courses: [],
    filteredCourses: [],
    filter: '',
    filterType: '',
    loadingError: false,
    activePage: 0
  };

  constructor(props) {
    super(props);
    this.state.framework = props.framework;
    this.state.version = props.version;
  }

  coursesService = new CoursesService();
  activeRequests = new ActiveRequestsService();

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.activeRequests.startRequest();
      const allCourses = await this.coursesService.getCourses(
        0,
        this.state.filter,
        this.state.filterType
      );
      const courses = this.filterCourses(allCourses);
      this.setState({ courses, filteredCourses: courses });
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
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
        //profile => (profile.title || '').toLowerCase() === framework
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
    //console.log(filteredCourses);
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
        <td>{index + 1} </td>
        <td>
          <Link to={`/training-resources/${course.id}`}>{course.title}</Link>
        </td>
        <td>{course.type}</td>
        <td>
          <ul>{competencyList(course.competencies)} </ul>
        </td>
      </tr>
    ));

    return (
      <>
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
            itemsCountPerPage={50}
            totalItemsCount={this.state.totalItemsCount}
            pageRangeDisplayed={5}
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
      </>
    );
  }
}

export default Courses;
