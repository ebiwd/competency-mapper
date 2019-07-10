import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReactModal from 'react-modal';
import AttributeMap from './AttributeMap';
import Parser from 'html-react-parser';

import { apiUrl } from '../services/http/http';

class ResourceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      frameworks: [],
      resourcePath: this.props.location.pathname.split('/'),
      showModal: false,
      selectedFramework: '',
      updateFlag: ''
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal(event, temp) {
    this.setState({ showModal: true });
    this.setState({ selectedFramework: event });
    temp.preventDefault();
    //console.log(event);
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ updateFlag: true });
  }

  componentDidUpdate() {
    if (this.state.updateFlag) {
      this.fetchData();
      setTimeout(() => {
        this.setState({ updateFlag: false });
      }, 1000);
      console.log('componentDidUpdate');
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    let resourcesURL = `${apiUrl}/api/v1/training-resources/all?_format=hal_json`;

    fetch(resourcesURL)
      .then(Response => Response.json())
      .then(findresponse3 => {
        this.setState({ resources: findresponse3 });
      });

    fetch(`${apiUrl}/api/v1/framework?_format=json`)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          frameworks: findresponse
        });
      });
  }

  mappingBlock() {
    if (localStorage.getItem('roles')) {
      if (localStorage.getItem('roles').includes('content_manager')) {
        return (
          <div className={'callout white-color industry-background'}>
            <strong> Manage competency profile </strong>
            <ul>
              {this.state.frameworks.map((item, id) => {
                return (
                  <li style={{ display: 'inline', margin: '5px' }}>
                    <a // eslint-disable-line jsx-a11y/anchor-is-valid
                      onClick={this.handleOpenModal.bind(
                        this,
                        item.name.toLowerCase()
                      )}
                    >
                      {' '}
                      <i className="fas fa-tags" /> {item.name}{' '}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
  }

  render() {
    let attributes = [];
    let selectedCompetencies = [];
    let attribute_types = [];
    //console.log(this.state.resources);
    const Resource = this.state.resources.map((item, index) => {
      if (item.id === this.state.resourcePath[2]) {
        item.competency_profile.map(profile =>
          profile.domains.map(domain =>
            domain.competencies.map(competency =>
              //selectedCompetencies.push(),
              competency.attributes.map(
                attribute =>
                  attributes.push(attribute.uuid + 'id' + attribute.id),
                selectedCompetencies.push(competency.id)
              )
            )
          )
        );

        //console.log(attributes);

        return (
          <div>
            <div>
              <div className={'row'}>
                <h2>{item.title}</h2>
              </div>

              <div className={'row'}>
                <div className={'column large-9'}>
                  <div className={'callout'}>
                    {item.date ? (
                      <p>
                        <strong>Date:</strong> {item.dates}
                      </p>
                    ) : (
                      ''
                    )}
                    {item.keywords ? (
                      <p>
                        <strong>Keywords:</strong> {item.keywords}
                      </p>
                    ) : (
                      ''
                    )}
                    {item.location ? (
                      <p>
                        <strong>Location:</strong> {item.location}
                      </p>
                    ) : (
                      ''
                    )}
                    {item.type ? (
                      <p>
                        <strong>Type:</strong> {item.type}
                      </p>
                    ) : (
                      ''
                    )}
                    {item.url ? (
                      <p>
                        <strong> URL: </strong>{' '}
                        <a href={item.url} target={'_blank'}>
                          {item.url}
                        </a>
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                  <h3>Overview</h3>
                  {Parser(item.description)}

                  {item.target_audience
                    ? Parser('<h3>Target Audience</h3>' + item.target_audience)
                    : ''}
                  {item.learning_outcomes
                    ? Parser(
                        '<h3>Learning Outcomes</h3>' + item.learning_outcomes
                      )
                    : ''}
                  {item.organisers
                    ? Parser('<h3>Organizers</h3>' + item.organisers)
                    : ''}

                  {item.trainers
                    ? Parser('<h3>Trainers</h3>' + item.trainers)
                    : ''}
                  <h3>Competency Profile</h3>
                  <table className={'hover'}>
                    <tbody>
                      {item.competency_profile.map(profile => {
                        return (
                          <tr>
                            {this.state.frameworks.map(framework => {
                              if (framework.id === profile.id) {
                                framework.attribute_types.map(type =>
                                  attribute_types.push(type.title)
                                );
                              }
                              return null;
                            })}
                            <td>
                              <h4>{profile.title}</h4>
                            </td>
                            <td>
                              {profile.domains.map(domain => (
                                <div>
                                  <h5>{domain.title}</h5>
                                  <ul>
                                    {domain.competencies.map(competency => (
                                      <li>
                                        <strong> {competency.title}</strong>
                                        <ul>
                                          {attribute_types.map(type => (
                                            <span>
                                              {competency.attributes.map(
                                                attribute => {
                                                  if (attribute.type === type) {
                                                    return (
                                                      <li>
                                                        {' '}
                                                        <em>{type}</em> -{' '}
                                                        {attribute.title}
                                                      </li>
                                                    );
                                                  }
                                                  return null;
                                                }
                                              )}
                                            </span>
                                          ))}
                                        </ul>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div
                  className={
                    'column large-3 callout industry-background white-color'
                  }
                >
                  <h3>More information</h3>
                  <p>
                    We can place some relevant information in this block to make
                    the page look more beautiful
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    });

    return (
      <div className={'row'}>
        <div className={'column large-12'}>
          {Resource}
          {this.mappingBlock()}
        </div>

        <div style={{ overflow: 'scroll' }}>
          <ReactModal
            isOpen={this.state.showModal}
            className="Modal"
            overlayClassName="Overlay"
            contentLabel="Minimal Modal Example"
          >
            <div>
              <h2 style={{ 'text-align': 'center' }}>
                Manage competency profile for{' '}
                {this.state.selectedFramework.toUpperCase()}{' '}
                <i
                  className="fas fa-window-close float-right"
                  data-close
                  onClick={this.handleCloseModal}
                />{' '}
              </h2>
            </div>
            <table>
              <AttributeMap
                selectedCompetencies={selectedCompetencies}
                selectedAttributes={attributes}
                selectedFramework={this.state.selectedFramework}
                resourceID={this.state.resourcePath[2]}
                handleCloseModal={this.handleCloseModal}
              />
            </table>
          </ReactModal>
        </div>
      </div>
    );
  }
}

const ResDetails = () => (
  <Switch>
    <Route exact path="/training-resources/:id" component={ResourceDetails} />
  </Switch>
);

export default ResDetails;
