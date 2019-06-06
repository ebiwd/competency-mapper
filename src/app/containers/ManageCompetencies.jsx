import React from 'react';
import { Link } from 'react-router-dom';

import { withSnackbar } from 'notistack';
import InlineEdit from '../../shared/components/edit-inline/EditInline';

import { apiUrl } from '../services/competency/competency';

import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

class ManageCompetencies extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  onSelectChange = this.onSelectChange.bind(this);

  state = {
    framework: this.props.match.params.framework,
    frameworkName: '',
    frameworkData: [],
    loadingError: false,

    domainID: '',
    domainUUID: '',
    selectedDomainID: '',
    selectDefaultValue: 'Select domain',
    domainAlert: false
  };

  static getDerivedStateFromProps(props, state) {
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (props.match.params.framework !== state.framework) {
      return {
        framework: props.match.params.framework,
        loadingError: false,
        frameworkData: []
      };
    }

    // No state update necessary
    return null;
  }

  async componentDidMount() {
    const { framework, domainId } = this.props.match.params;
    await this.fetchFramework(framework);

    if (domainId) {
      setTimeout(() => {
        const ref = this.refs[domainId];
        if (ref) {
          ref.scrollIntoView();
        }
      }, 0);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { frameworkData, loadingError } = this.state;
    if (frameworkData.length === 0 && !loadingError) {
      const { framework } = this.props.match.params;
      this.fetchFramework(framework);
    }
  }

  async fetchFramework(framework) {
    try {
      this.activeRequests.startRequest();
      const frameworkData = await this.competencyService.getFramework(
        framework
      );

      if (frameworkData.length) {
        this.setState({
          frameworkName: frameworkData[0].title,
          frameworkData
        });
      }
    } catch (e) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
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
  }

  async dataChanged(cid, title) {
    const { framework } = this.state;
    this.activeRequests.startRequest();
    // TODO: try
    await this.competencyService.patchCompetency(cid, 'title', title);
    await this.fetchFramework(framework);
    // TODO: catch
    // TODO: display possible errors on a toast/snackbar
    // TODO: finally
    this.activeRequests.finishRequest();
  }

  async toggleArchive(cid, isArchived) {
    const { framework } = this.state;
    let archive = isArchived ? false : true;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchCompetency(
        cid,
        'field_archived',
        archive
      );
      await this.fetchFramework(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
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

  render() {
    const {
      framework,
      frameworkName,
      frameworkData,
      loadingError
    } = this.state;

    if (loadingError) {
      // TODO: display errors on a toast/snackbar
      return (
        <div className="margin-top-large callout alert">
          {' '}
          Sorry, there was a problem when fetching the data!
        </div>
      );
    }

    if (frameworkData.length === 0) {
      return null;
    }

    let competencies = '';
    let domainsOptions = [];

    competencies = frameworkData.map(item =>
      item.domains.map((domain, parentIndex) => (
        <tbody key={domain.nid} ref={domain.nid}>
          <tr className="white-color secondary-background">
            <td>{parentIndex + 1}</td>
            <td>
              <h4>{domain.title}</h4>
            </td>
            <td className="small-1">Archive</td>
            <td>Manage attributes</td>
          </tr>
          {domain.competencies.map((competency, index) => (
            <tr key={competency.id}>
              <td>
                {parentIndex + 1}.{index + 1}
              </td>
              <td>
                <InlineEdit
                  text={competency.title}
                  data-id="12"
                  staticElement="div"
                  paramName="message"
                  change={data => this.dataChanged(competency.id, data.message)}
                  style={{
                    display: 'inline-block',
                    margin: 0,
                    padding: 10,
                    border: 1,
                    width: '100%',
                    fontSize: '120%'
                  }}
                />
              </td>
              <td>
                <button
                  className="cursor"
                  onClick={this.toggleArchive.bind(
                    this,
                    competency.id,
                    competency.archived
                  )}
                >
                  {competency.archived === 1 ? (
                    <span className="fas fa-toggle-on">
                      <span>Archived</span>
                    </span>
                  ) : (
                    <span className="fas fa-toggle-off" />
                  )}
                </button>
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
      <div className="row">
        <h2>Manage framework</h2>

        <h4>{frameworkName}</h4>

        <div className="callout">
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
                  onChange={this.onSelectChange}
                >
                  {/*<option data-id="null" value="Select domain" disabled>Select domain
                                                </option>*/}
                  {domainsOptions}
                </select>
                {this.state.domainAlert ? (
                  <div>
                    <span style={{ color: 'red' }}>Please select domain </span>{' '}
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

        <table>{competencies}</table>
      </div>
    );
  }
}

export default withSnackbar(ManageCompetencies);
