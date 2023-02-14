import React from 'react';
import { Link } from 'react-router-dom';
import Parser from 'html-react-parser';
import { withSnackbar } from 'notistack';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';
import CoursesService from '../services/courses/courses';
import { slugify } from '../services/util/slugifier';
import MetaTags from 'react-meta-tags';

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
    resources: [],
    competency: []
  };

  async componentDidMount() {
    try {
      this.activeRequests.startRequest();
      await Promise.all([
        this.getFramework(),
        this.getAttributes(),
        this.getResources()
      ]).then(() => {
        const params = new URLSearchParams(window.location.search);
        let scroll = params.get('scroll');
        if (scroll === 'true') {
          let element = document.getElementById('training-resources-block');
          if (element) {
            element.scrollIntoView();
            element.scrollIntoView(false);
            element.scrollIntoView({ block: 'start' });
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }
      });
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
      const resources = await this.coursesService.getByCompetency(
        this.state.competencyId
      );
      // const resources = allResources.filter(
      //   resource =>
      //     resource.archived === 'no' &&
      //     !!resource.competency_profile.find(
      //       profile => profile.competency_id === this.state.competencyId
      //     )
      // );

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
      <li key={resource.nid}>
        <Link
          to={{
            pathname: `/training-resources/${slugify(resource.title)}`,
            state: {
              training_resource_id: resource.nid
            }
          }}
        >
          {resource.title}
        </Link>
        {/*<Link to={`/training-resources/${resource.nid}`}>{resource.title}</Link>*/}
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
        <div className="vf-grid">
          <div>
            <h1>{competency.title}</h1>
            <br />
            <br />
            <h2>Competency attributes</h2>
            <ul>
              {attributeDefs.map(def => {
                return (
                  <div key={def}>
                    <div className="margin-top-medium">
                      {' '}
                      <h3>{def}</h3>
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

            <div>
              <h2>Competency derived from:</h2>
              <p>
                {' '}
                {competency.mapped_other_competency
                  ? Parser(competency.mapped_other_competency)
                  : 'No data available'}{' '}
              </p>

              {resources.length === 0 ? null : (
                <div id="training-resources-block">
                  <h2>Training resources associated with this competency</h2>
                  <ul>{this.resourceBlock()}</ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        {competencies.length > 0 ? (
          <MetaTags>
            <title>{competencies[0].title}</title>
            <meta name="description" content={competencies[0].title} />
            <meta property="og:title" content={competencies[0].title} />
            <meta
              property="keywords"
              content={`competency, competency-based training, ${
                competencies[0].domain
              }, ${
                competencies[0].framework === 'ISCB'
                  ? 'computational biology competencies'
                  : ''
              }`}
            />
          </MetaTags>
        ) : (
          ''
        )}

        {competencyDetails}
      </div>
    );
  }
}

export default withSnackbar(CompetencyDetails);
