import React from 'react';
import { Link } from 'react-router-dom';

import { apiUrl } from '../services/competency/competency';

class CompetencyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      path: this.props.location.pathname.split('/'),
      cid: '',
      frameworkDetails: [],
      resources: []
    };
  }

  componentDidMount() {
    this.setState({ cid: this.state.path[5] });

    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    let frameworkID = this.state.path[2].toLowerCase();
    let fetchCompetencyList =
      `${apiUrl}/api/v1/framework/` + frameworkID + '?_format=json';
    fetch(fetchCompetencyList)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse
        });
      });

    let fetchFrameworkDetails = `${apiUrl}/api/v1/framework?_format=json`;
    fetch(fetchFrameworkDetails)
      .then(Response => Response.json())
      .then(findresponse1 => {
        this.setState({
          frameworkDetails: findresponse1
        });
      });

    fetch(`${apiUrl}/api/v1/training-resources/all?_format=json`)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({ resources: findresponse });
      });
  }

  resourceBlock() {
    return this.state.resources.map(resource =>
      resource.competency_profile.map(profile =>
        profile.domains.map(domain =>
          domain.competencies
            .filter(competency => competency.id === this.state.cid)
            .map(competency => {
              return (
                <li>
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
    let frameworkDefs = [];

    const competencyDetails = this.state.data.map(item =>
      item.domains.map(domain =>
        domain.competencies.map(competency => {
          // domain.competencies.filter(competency => competency.id === this.state.cid).map(competency =>{
          if (competency.id === this.state.cid) {
            return (
              <div>
                <div className="row">
                  <div className="column large-12">
                    <h4>
                      {' '}
                      {item.title} / {domain.title}
                    </h4>
                    <h4>{competency.title}</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="column large-8">
                    <ul>
                      {frameworkDefs.map(def => {
                        return (
                          <div>
                            <div>
                              {' '}
                              <strong>
                                <em>{def}</em>
                              </strong>
                            </div>
                            {competency.attributes.map(attribute => {
                              if (attribute.type === def) {
                                return (
                                  <li key={attribute.id}>{attribute.title} </li>
                                );
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
            );
          }
          return null;
        })
      )
    );

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

export default CompetencyDetails;
