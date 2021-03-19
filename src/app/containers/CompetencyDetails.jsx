import React from 'react';
import { Link } from 'react-router-dom';
import Parser from 'html-react-parser';
import { withSnackbar } from 'notistack';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';
import CoursesService from '../services/courses/courses';

class CompetencyDetails extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  coursesService = new CoursesService();

  state = {
    framework: this.props.match.params.framework,
    version: this.props.location.pathname.split('/'),
    frameworkData: [],
    competencyId: this.props.match.params.cid,
    attributeDefs: [],
    resources: []
  };

  async componentDidMount() {
    try {
      this.activeRequests.startRequest();
      await Promise.all([
        this.getFramework(),
        this.getAttributes(),
        this.getResources()
      ]);
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async getFramework() {
    const { framework } = this.state;
    const { version } = this.state;
    const frameworkData = await this.competencyService.getVersionedFramework(
      framework,
      version[3]
    );

    this.setState({
      frameworkData
    });
  }

  async getAttributes() {
    const allFrameworks = await this.competencyService.getAllFrameworks();
    const { framework } = this.state;
    const frameworkMatch = allFrameworks.filter(
      item => item.name.toLowerCase() === framework
    );
    if (frameworkMatch.length) {
      const attributeDefs = frameworkMatch[0].attribute_types.map(
        attribute => attribute.title
      );
      this.setState({ attributeDefs });
    }
  }

  async getResources() {
    try {
      const allResources = await this.coursesService.getCourses(0, '', '');
      const resources = allResources.filter(
        resource =>
          resource.archived === 'no' &&
          !!resource.competency_profile.find(
            profile => profile.competency_id === this.state.competencyId
          )
      );

      this.setState({ resources });
      /*const resources = [{"id":1, "title":this.state.version[3]}];*/
      this.setState({ resources });
    } catch (error) {
      this.props.enqueueSnackbar('Unable to retrieve training resources', {
        variant: 'error'
      });
    }
  }

  resourceBlock() {
    const { resources } = this.state;
    return resources.map(resource => (
      <li key={resource.id}>
        <Link to={`/training-resources/${resource.id}`}>{resource.title}</Link>
      </li>
    ));
  }

  render() {
    const {
      competencyId,
      frameworkData,
      attributeDefs,
      resources
    } = this.state;

    const competencies = [];
    console.log(frameworkData);
    frameworkData.forEach(item =>
      item.domains.forEach(domain =>
        domain.competencies.forEach(competency => {
          if (competency.id === competencyId) {
            competencies.push({
              ...competency,
              framework: item.title,
              domain: domain.title
            });
          }
        })
      )
    );

    const competencyDetails = competencies.map(competency => (
      <div key={competency.id}>
        <h4>
          {' '}
          {competency.framework} / {competency.domain}
        </h4>

        <div className="vf-grid">
          <div>
            <h3>{competency.title}</h3>
            <ul>
              {attributeDefs.map(def => {
                return (
                  <div key={def}>
                    <div className="margin-top-medium">
                      {' '}
                      <strong>
                        <em>{def}</em>
                      </strong>
                    </div>
                    {competency.attributes.map(attribute => {
                      if (attribute.type === def) {
                        return <li key={attribute.id}>{attribute.title} </li>;
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </ul>
          </div>

          <div>
            <h4>Competency derived from:</h4>
            <p>
              {' '}
              {competency.mapped_other_competency
                ? Parser(competency.mapped_other_competency)
                : 'No data available'}{' '}
            </p>

            {resources.length === 0 ? null : (
              <div>
                <h4>Training resources mapped to this competency</h4>
                <ul>{this.resourceBlock()}</ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ));

    return (
      <div className="row">
        <div className="column large-12">
          {frameworkData.length > 0 ? (
            <nav className="vf-breadcrumbs" aria-label="Breadcrumb">
              <ul class="vf-breadcrumbs__list | vf-list vf-list--inline">
                <li class="vf-breadcrumbs__item">
                  <Link to="/" class="vf-breadcrumbs__link">
                    Home
                  </Link>
                </li>
                <li class="vf-breadcrumbs__item">
                  <Link
                    to={`/framework/${frameworkData[0].title.toLowerCase()}/${
                      frameworkData[0].version
                    }`}
                  >
                    {frameworkData[0].title} {frameworkData[0].version}
                  </Link>{' '}
                </li>
                <li class="vf-breadcrumbs__item" aria-current="location">
                  Competency details
                </li>
              </ul>
            </nav>
          ) : (
            ''
          )}

          <h3>Competency details</h3>

          {competencyDetails}
        </div>
      </div>
    );
  }
}

export default withSnackbar(CompetencyDetails);
