import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import ErrorLoading from '../../components/error-loading/ErrorLoading';

import ActiveRequestsService from '../../services/active-requests/active-requests';
import CoursesService from '../../services/courses/courses';
import { safeFlat } from '../../services/util/util';

class Courses extends Component {
  static propTypes = {
    framework: PropTypes.string,
    version: PropTypes.string
  };

  state = {
    courses: [],
    filteredCourses: [],
    filter: '',
    loadingError: false
  };

  constructor(props) {
    super(props);
    this.state.framework = props.framework;
    this.state.version = props.version;
  }

  coursesService = new CoursesService();
  activeRequests = new ActiveRequestsService();

  async componentDidMount() {
    try {
      this.activeRequests.startRequest();
      const allCourses = await this.coursesService.getCourses();
      const courses = this.filterCourses(allCourses);
      this.setState({ courses, filteredCourses: courses });
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  filterCourses(allCourses) {
    const { framework } = this.state;
    const { version } = this.state;
    const filteredCourses = [];
    allCourses.forEach(course => {
      if (course.archived === '1') {
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

    const resources = filteredCourses.map(course => (
      <tr key={course.id}>
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
        {/* <input
          type="search"
          // className="clearable" // It doesn't work correctly
          value={filter}
          onChange={event => this.onFilter(event.target.value)}
          placeholder="Filter resources"
        /> */}
        <form action="#" class="vf-form | vf-search vf-search--inline">
          <div className="vf-form__item | vf-search__item">
            <label
              className="vf-form__label vf-u-sr-only | vf-search__label"
              for="inlinesearchitem"
            >
              Inline search
            </label>
            <input
              type="search"
              placeholder="Filter training resources"
              id="inlinesearchitem"
              className="vf-form__input | vf-search__input"
              onChange={event => this.onFilter(event.target.value)}
              value={filter}
            />
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <th>Training resource(s)</th>
              <th>Type</th>
              <th>Competencies</th>
            </tr>
          </thead>
          <tbody>{resources}</tbody>
        </table>
      </>
    );
  }
}

export default Courses;
