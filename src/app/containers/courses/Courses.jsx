import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import ErrorLoading from '../../components/error-loading/ErrorLoading';

import ActiveRequestsService from '../../services/active-requests/active-requests';
import CoursesService from '../../services/courses/courses';
import { safeFlat } from '../../services/util/util';

class Courses extends Component {
  static propTypes = {
    framework: PropTypes.string
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
    const filteredCourses = [];
    allCourses.forEach(course => {
      if (course.archived === '1') {
        return;
      }

      const filteredProfiles = course.competency_profile.filter(
        profile => (profile.title || '').toLowerCase() === framework
      );

      if (filteredProfiles.length === 0) {
        return;
      }

      const modifiedCourse = {
        ...course,
        competencies: safeFlat(
          filteredProfiles.map(profile =>
            safeFlat(
              profile.domains.map(domain =>
                domain.competencies.map(competency => ({
                  ...competency,
                  domain: domain.title
                }))
              )
            )
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

  render() {
    const { filteredCourses, framework, filter, loadingError } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    const competencyList = competencies =>
      competencies.map(competency => (
        <li key={competency.id}>
          <Link
            to={`/framework/${framework}/competency/details/${competency.id}`}
          >
            {competency.title}
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
          <ul>{competencyList(course.competencies)}</ul>
        </td>
      </tr>
    ));

    return (
      <>
        <input
          type="search"
          // className="clearable" // It doesn't work correctly
          value={filter}
          onChange={event => this.onFilter(event.target.value)}
          placeholder="Filter resources"
        />
        <table>
          <tbody>{resources}</tbody>
        </table>
      </>
    );
  }
}

export default Courses;
