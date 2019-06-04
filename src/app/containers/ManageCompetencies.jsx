import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';

import { apiUrl } from '../services/competency/competency';

class ManageCompetencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      goToDomainId: props.match.params.cid,
      framework: props.match.params.framework.toLowerCase(),
      csrf: '',
      domainID: '',
      domainUUID: '',
      selectedDomainID: '',
      selectDefaultValue: 'Select domain',
      domainAlert: false,
      selectedCompetency: '',
      updateFlag: '',
      roles: ''
    };
    this.dataChanged = this.dataChanged.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.archiveHandle = this.archiveHandle.bind(this);
  }

  /*shouldComponentUpdate(nextProps, nextState) {
        return this.state.data != nextState.data;
    }*/

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      this.fetchData();
      setTimeout(() => {
        this.setState({ updateFlag: false });
      }, 1000);
      console.log('componentDidUpdate');
    }

    if (this.state.goToDomainId) {
      const ref = this.refs[this.state.goToDomainId];
      if (ref) {
        ref.scrollIntoView();
      }
    }
  }

  componentDidMount() {
    this.fetchData();
    if (localStorage.getItem('roles')) {
      this.setState({ roles: localStorage.getItem('roles') });
    }
    this.checkUser();
  }

  fetchData() {
    const { framework } = this.state;
    const fetchCompetencyList = `${apiUrl}/api/v1/framework/${framework}?_format=json`;
    fetch(fetchCompetencyList)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse
        });
      });
  }

  handleSubmit(event) {
    let token = localStorage.getItem('csrf_token');
    let domainID = this.state.selectedDomainID;
    let title = this.refs.title.value;
    let domainUUID = this.refs.domain_ref.value;

    fetch(`${apiUrl}/node?_format=hal_json`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'X-CSRF-Token': token,
        Accept: 'application/hal+json',
        'Content-Type': 'application/hal+json'
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: `${apiUrl}/rest/type/node/competency`
          },
          [`${apiUrl}/rest/relation/node/competency/field_domain`]: {
            href: `${apiUrl}/node/` + domainID + '?_format=hal_json'
          },
          [`${apiUrl}/rest/relation/node/competency/uid`]: {
            href: `${apiUrl}/user/1?_format=hal_json`
          }
        },
        title: [
          {
            value: title
          }
        ],
        type: [
          {
            target_id: 'competency'
          }
        ],

        _embedded: {
          [`${apiUrl}/rest/relation/node/competency/field_domain`]: [
            {
              _links: {
                self: {
                  href: `${apiUrl}/node/` + domainID + '?_format=hal_json'
                },
                type: {
                  href: `${apiUrl}/rest/type/node/domain`
                }
              },
              uuid: [
                {
                  value: domainUUID
                }
              ],
              lang: 'en'
            }
          ],
          [`${apiUrl}/rest/relation/node/competency/uid`]: [
            {
              _links: {
                self: {
                  href: `${apiUrl}/user/1?_format=hal_json`
                },
                type: {
                  href: `${apiUrl}/rest/type/user/user`
                }
              },
              uuid: [
                {
                  value: 'a6a85d5c-1fd9-4324-ab73-fdc27987d8cc'
                }
              ],
              lang: 'en'
            }
          ]
        }
      })
    });
    this.refs.title.value = '';

    this.setState({ updateFlag: true });

    event.preventDefault();
  }

  dataChanged(e) {
    let title = e['message'];
    let cid = this.state.selectedCompetency;
    let token = localStorage.getItem('csrf_token');
    //alert(cid);
    fetch(`${apiUrl}/node/` + cid + '?_format=hal_json', {
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
            href: `${apiUrl}/rest/type/node/competency`
          }
        },
        title: [
          {
            value: title
          }
        ],
        type: [
          {
            target_id: 'competency'
          }
        ]
      })
    });
    this.setState({ updateFlag: true });
  }

  selectedCompetency(id) {
    this.setState({ selectedCompetency: id });
  }

  archiveHandle(cid, status, event) {
    //alert("competency "+ cid+ "is "+ status);
    let archivedStatus = '';
    if (status === 1) {
      archivedStatus = false;
    } else {
      archivedStatus = true;
    }
    let token = localStorage.getItem('csrf_token');
    fetch(`${apiUrl}/node/` + cid + '?_format=hal_json', {
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
            href: `${apiUrl}/rest/type/node/competency`
          }
        },
        field_archived: [
          {
            value: archivedStatus
          }
        ],
        type: [
          {
            target_id: 'competency'
          }
        ]
      })
    });

    this.setState({ updateFlag: true });

    event.preventDefault();
  }
  onSelectChange(e) {
    this.setState({ domainAlert: false });
    let index = e.target.selectedIndex;
    let optionElement = e.target.childNodes[index];
    let option = optionElement.getAttribute('data-id');
    this.setState({ selectedDomainID: option });
    //this.setState({selectDefaultValue: optionElement.value});
    //this.setState({selectDefaultValue: optionElement.value});
    //console.log(this.state.selectDefaultValue);
  }

  checkUser() {
    if (!localStorage.getItem('roles')) {
      this.props.history.push('/');
    } else if (!localStorage.getItem('roles').includes('framework_manager')) {
      alert(
        'You are not authorised to access this page. Contact the administrator'
      );
      this.props.history.push('/');
    }
    console.log(localStorage.getItem('roles'));
  }

  render() {
    this.checkUser();
    console.log('render');
    let competencies = '';
    let domainsOptions = [];
    const { framework } = this.state;

    competencies = this.state.data.map(item =>
      item.domains.map((domain, did) => (
        <tbody key={domain.nid} ref={domain.nid}>
          <tr className="white-color secondary-background">
            <td />
            <td>{did + 1}</td>
            <td>
              <h4>{domain.title}</h4>
            </td>
            <td>Archive?</td>
            <td>Manage attributes</td>
          </tr>
          {domain.competencies.map((competency, cid) => (
            <tr key={competency.id}>
              <td>
                <i className="fas fa-arrows-alt position-icon" />{' '}
              </td>
              <td>
                {did + 1}.{cid + 1}
              </td>
              <td
                className="tooltip-td"
                onClick={this.selectedCompetency.bind(this, competency.id)}
              >
                <InlineEdit
                  text={competency.title}
                  data-id="12"
                  staticElement="div"
                  paramName="message"
                  change={this.dataChanged.bind(this)}
                  style={{
                    display: 'inline-block',
                    margin: 0,
                    padding: 10,
                    border: 1,
                    width: '100%',
                    fontSize: '120%'
                  }}
                />
                <span
                  style={{
                    float: 'right',
                    position: 'relative',
                    fontSize: '12px'
                  }}
                >
                  <strong> {competency.archived ? '[Archived]' : ''}</strong>
                </span>
              </td>
              <td>
                {competency.archived === 1 ? (
                  <a // eslint-disable-line jsx-a11y/anchor-is-valid
                    onClick={this.archiveHandle.bind(this, competency.id, 1)}
                  >
                    <i className="fas fa-toggle-on" />
                  </a>
                ) : (
                  <a // eslint-disable-line jsx-a11y/anchor-is-valid
                    onClick={this.archiveHandle.bind(this, competency.id, 0)}
                  >
                    <i className="fas fa-toggle-off" />
                  </a>
                )}
              </td>
              <td>
                <Link
                  to={`/framework/${framework}/manage/competencies/${
                    competency.id
                  }/manage-attributes`}
                >
                  <i className="fas fa-sitemap" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      ))
    );

    return (
      <div>
        <h2>Manage Framework - {framework.toUpperCase()} </h2>

        <div className="row">
          <div className="column large-12 callout">
            <h4>Create new competency</h4>
            <form className="form" onSubmit={this.handleSubmit.bind(this)}>
              <div className="row">
                <div className="column large-7">
                  <input
                    type="text"
                    ref="title"
                    required
                    placeholder="Enter competency description"
                  />
                </div>
                <div className="column large-3">
                  <select
                    ref="domain_ref"
                    id="select_domain"
                    onChange={this.onSelectChange.bind(this)}
                  >
                    {/*<option data-id="null" value="Select domain" disabled>Select domain
                                                </option>*/}
                    {domainsOptions}
                  </select>
                  {this.state.domainAlert ? (
                    <div>
                      <span style={{ color: 'red' }}>
                        Please select domain{' '}
                      </span>{' '}
                      <i className="far fa-frown"> </i>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="column large-2">
                  <input type="submit" className="button" value="Create new" />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="column large-12">
            <table>{competencies}</table>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageCompetencies;
