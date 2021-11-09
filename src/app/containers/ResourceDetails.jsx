import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReactModal from 'react-modal';
import AttributeMap from './AttributeMap';
import Parser from 'html-react-parser';
import ItemVersions from '../containers/framework-versions/VersionNotice';
import { apiUrl } from '../services/http/http';
import { editApiUrl } from '../services/http/http';
import { Link } from 'react-router-dom';

class ResourceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: [],
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
    }
  }

  async componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    //&timestamp=${Date.now()}

    /*let resourcesURL = `${apiUrl}/api/v1/training-resources/all?_format=hal_json`;*/
    console.log('res path', this.state);
    let resourcesURL = `${apiUrl}/api/resources/?_format=json&id=${
      this.state.resourcePath[2]
    }&timestamp=${Date.now()}`;
    console.log(resourcesURL);
    fetch(resourcesURL)
      .then(Response => Response.json())
      .then(findresponse3 => {
        this.setState({ resource: findresponse3 });
      });

    //fetch(`${apiUrl}/api/v1/framework?_format=json`)
    fetch(`${apiUrl}/api/version_manager?_format=json`)
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
          <div>
            <strong> Manage competency profile </strong>
            <ul>
              {this.state.frameworks.map((item, id) => {
                return (
                  <li style={{ display: 'inline', margin: '5px' }}>
                    <Link
                      to={
                        '/training-resources/' +
                        this.state.resourcePath[2] +
                        '/map/' +
                        item.title.toLowerCase().replace(/ /g, '')
                      }
                    >
                      {' '}
                      <i className="fas fa-tags" /> {item.title}{' '}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
  }

  formatDates(start, end) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    let start_dt = new Date(start);
    let end_date = new Date(end);

    let start_day = start_dt.getDate();
    let start_month = start_dt.getMonth();
    let start_year = start_dt.getFullYear();

    if (end) {
      let end_day = end_date.getDate();
      let end_month = end_date.getMonth();
      let end_year = end_date.getFullYear();

      if (start_year === end_year) {
        if (start_month === end_month) {
          if (start_day === end_day) {
            return start_day + ' ' + months[start_month] + ' ' + start_year;
          } else {
            return (
              start_day +
              ' - ' +
              end_day +
              ' ' +
              months[start_month] +
              ' ' +
              start_year
            );
          }
        } else {
          return (
            start_day +
            ' ' +
            months[start_month] +
            ' - ' +
            end_day +
            ' ' +
            months[end_month] +
            ' ' +
            start_year
          );
        }
      } else {
        return (
          start_day +
          ' ' +
          months[start_month] +
          ' ' +
          start_year +
          ' - ' +
          end_day +
          ' ' +
          months[end_month] +
          ' ' +
          end_year
        );
      }
    } else {
      return start_day + ' ' + months[start_month] + ' ' + start_year;
    }
  }
  checkUser() {
    if (!localStorage.getItem('roles')) {
      return false;
    } else if (!localStorage.getItem('roles').includes('content_manager')) {
      return false;
    } else {
      return true;
    }
  }

  archiveHandle(rid, status, event) {
    console.log(status);
    let archivedStatus = '';
    if (status === 1) {
      archivedStatus = false;
    } else {
      archivedStatus = true;
    }
    let token = localStorage.getItem('csrf_token');
    fetch(`${apiUrl}/node/` + rid + '?_format=hal_json', {
      credentials: 'include',
      method: 'PATCH',
      cookies: 'x-access-token',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/hal+json',
        'X-CSRF-Token': token,
        Authorization: 'Basic'
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: `${editApiUrl}/rest/type/node/training_resource`
          }
        },
        field_archived: [
          {
            value: archivedStatus
          }
        ],
        type: [
          {
            target_id: 'training_resource'
          }
        ]
      })
    });

    this.setState({ updateFlag: true });

    event.preventDefault();
  }

  render() {
    let attributes = [];
    let selectedCompetencies = [];
    let attribute_types = [];
    let item = this.state.resource;
    let frameworkLiveVersion = '';

    let link = '/bioexcel/1.1';
    let check_array = Array.isArray(item.competency_profile);
    const Resource = (
      <>
        <h2>{item.title}</h2>
        <div className="vf-grid  vf-grid__col-4">
          <div className="vf-grid__col--span-3">
            <h3>Overview</h3>
            {item.description ? Parser(item.description) : ''}

            {item.url ? (
              <p>
                <a href={item.url} target={'_blank'}>
                  <button className="vf-button vf-button--primary vf-button--sm">
                    Go to resource
                  </button>
                </a>
              </p>
            ) : (
              ''
            )}

            {item.target_audience
              ? Parser('<h3>Target Audience</h3>' + item.target_audience)
              : ''}
            {item.learning_outcomes
              ? Parser('<h3>Learning Outcomes</h3>' + item.learning_outcomes)
              : ''}
            {item.organisers
              ? Parser('<h3>Organisers</h3>' + item.organisers)
              : ''}

            {/*{item.trainers ? Parser('<h3>Trainers</h3>' + item.trainers) : ''}*/}

            <div>
              <h3>Competency Profile</h3>

              <div>
                {check_array ? (
                  item.competency_profile.map((profile, index) => {
                    return (
                      <div className="vf-grid" key={index}>
                        {this.state.frameworks.map(framework => {
                          if (framework.nid === profile.id) {
                            framework.attribute_types.map(type => {
                              if (attribute_types.indexOf(type.title) === -1) {
                                attribute_types.push(type.title);
                              }
                              return null;
                            });
                            frameworkLiveVersion = framework.versions.find(
                              version => version.status === 'live'
                            );
                          }

                          return null;
                        })}
                        <div>
                          <h3>{profile.title}</h3>
                        </div>
                        <div>
                          {profile.domains.map((domain, index) => (
                            <div key={index}>
                              <h3>{domain.title}</h3>
                              <ul className="vf-list">
                                {domain.competencies.map(
                                  (competency, index) => (
                                    <li className="vf-list__item" key={index}>
                                      <span
                                        className={
                                          competency.archived === 'archived'
                                            ? 'archived'
                                            : ''
                                        }
                                      >
                                        <h4> {competency.title} </h4>
                                        {competency.archived === 'archived' ? (
                                          <ItemVersions
                                            framework="bioexcel"
                                            versions={link}
                                          />
                                        ) : (
                                          ''
                                        )}
                                      </span>
                                      <ul
                                        className="vf-list"
                                        style={{ marginLeft: '2rem' }}
                                      >
                                        {attribute_types.map((type, index) => (
                                          <span key={index}>
                                            <li className="vf-list__item vf-u-type__text-body--2">
                                              {competency.attributes.find(
                                                attribute =>
                                                  attribute.type === type
                                              )
                                                ? type
                                                : ''}
                                              <div class="vf-u-margin__top--500" />
                                              <ul className="vf-list vf-list--unordered">
                                                {competency.attributes.map(
                                                  (attribute, index) => {
                                                    if (
                                                      attribute.type === type
                                                    ) {
                                                      return (
                                                        <li
                                                          className="vf-list__item vf-u-type__text-body--2"
                                                          key={index}
                                                        >
                                                          <span
                                                            className={
                                                              attribute.archived ===
                                                              'archived'
                                                                ? 'archived'
                                                                : ''
                                                            }
                                                          >
                                                            {attribute.title}
                                                            {attribute.archived ===
                                                            'archived' ? (
                                                              <ItemVersions
                                                                framework={
                                                                  profile.title
                                                                }
                                                                version={
                                                                  frameworkLiveVersion.number
                                                                }
                                                              />
                                                            ) : (
                                                              ''
                                                            )}
                                                            {attribute.archived ===
                                                            'archived' ? (
                                                              <a
                                                                href={
                                                                  '/training-resources/' +
                                                                  item.id +
                                                                  '/demap/' +
                                                                  attribute.id
                                                                }
                                                              >
                                                                <i className="fas fa-times-circle" />
                                                              </a>
                                                            ) : (
                                                              ''
                                                            )}
                                                          </span>
                                                        </li>
                                                      );
                                                    }
                                                    return null;
                                                  }
                                                )}
                                              </ul>
                                            </li>
                                          </span>
                                        ))}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <tr>
                    <td />
                  </tr>
                )}
              </div>
            </div>
          </div>
          <div className="vf-grid__col--span-1">
            {this.checkUser() ? (
              <div className="float-right">
                <div>
                  <Link
                    to={'/training-resource/edit/' + this.state.resourcePath[2]}
                  >
                    <i className="fas fa-edit" /> Edit this resource{' '}
                  </Link>
                </div>
                {item.archived === 'archived' ? (
                  <a // eslint-disable-line jsx-a11y/anchor-is-valid
                    style={{ cursor: 'pointer' }}
                    onClick={this.archiveHandle.bind(this, item.id, 1)}
                  >
                    {' '}
                    <i className="fas fa-toggle-on" />{' '}
                    <span>Resource is archived</span>{' '}
                  </a>
                ) : (
                  <a // eslint-disable-line jsx-a11y/anchor-is-valid
                    style={{ cursor: 'pointer' }}
                    onClick={this.archiveHandle.bind(this, item.id, 0)}
                  >
                    {' '}
                    <i className="fas fa-toggle-off" />{' '}
                    <span>Archive this resource</span>
                  </a>
                )}
              </div>
            ) : (
              ''
            )}

            <p />

            <p>
              {item.trainers ? Parser('<h3>Trainers</h3>' + item.trainers) : ''}
            </p>

            {item.dates ? (
              <span>
                <strong>Dates:</strong>{' '}
                {this.formatDates(item.dates, item.end_date)}
              </span>
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
            {item.keywords ? (
              <p>
                <strong>Keywords:</strong> {item.keywords}
              </p>
            ) : (
              ''
            )}
          </div>
        </div>
      </>
    );

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
