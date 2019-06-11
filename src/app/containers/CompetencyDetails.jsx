import React from 'react';
import { Link } from 'react-router-dom';

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
    const frameworkData = await this.competencyService.getFramework(framework);

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
      const resources = await this.coursesService.getCourses();
      this.setState({ resources });
    } catch (error) {
      this.props.enqueueSnackbar('Unable to retrieve training resources', {
        variant: 'error'
      });
    }
  }

  resourceBlock() {
    const { resources } = this.state;
    return resources.map(resource =>
      resource.competency_profile.map(profile =>
        profile.domains.map(domain =>
          domain.competencies
            .filter(competency => competency.id === this.state.competencyId)
            .map(competency => {
              return (
                <li key={resource.id}>
                  <Link to={`/training-resources/${resource.id}`}>
                    {resource.title}
                  </Link>
                </li>
              );
            })
        )
      )
    );
  }

  render() {
    const { competencyId, frameworkData, attributeDefs } = this.state;

    const competencies = [];

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
        <div className="row">
          <div className="column large-12">
            <h4>
              {' '}
              {competency.framework} / {competency.domain}
            </h4>
            <h4>{competency.title}</h4>
          </div>
        </div>
        <div className="row">
          <div className="column large-8">
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
          <div className="column large-4">
            <div className="callout notice industry-background white-color">
              <p>Competency derived from:</p>
              <p>No data available</p>
            </div>
            <div className="callout notice training-background white-color">
              <p>Training resources mapped to this competency</p>
              <ul>{this.resourceBlock()}</ul>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="row">
        <div className="column large-12">
          <h3>Competency details</h3>
          {competencyDetails}
        </div>
      </div>
    );
  }
}

export default withSnackbar(CompetencyDetails);
