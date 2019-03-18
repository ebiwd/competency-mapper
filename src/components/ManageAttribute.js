import React from 'react';
import { Switch, Route } from 'react-router-dom';
import InlineEdit from 'react-edit-inline';
import CompetencyService, { apiUrl } from '../services/competency/compentency';
import Body from '../services/competency/body';
import Headers from '../services/competency/header';

class ManageAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valuesAttribute: '',
      attributeTypeID: '',
      attributeTypeUUID: '',
      selectedAttributeType: 0,
      data: [],
      csrf: '',
      path: this.props.location.pathname.split('/'),
      frameworkDetails: [],
      selectedCompetencyUUID: '',
      selectedCompetencyTitle: '',
      selectedAttribute: ''
    };

    this.competencyService = new CompetencyService();
    this.headers = new Headers();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      await this.fetchData();
      this.setState({ updateFlag: false });
    }
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const promise1 = this.fetchFramework();
    const promise2 = this.fetchFrameworkDetails();
    await promise1;
    await promise2;
  }

  async fetchFramework() {
    let framework = this.state.path[2].toLowerCase();
    const frameworkData = await this.competencyService.getFramework(framework);
    this.setState({ data: frameworkData });
  }

  async fetchFrameworkDetails() {
    const frameworkDetailsData = await this.competencyService.getAllFrameworks();
    this.setState({ frameworkDetails: frameworkDetailsData });
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
  }

  async handleSubmit() {
    let competencyID = this.state.path[5];
    let competecyUUID = this.state.selectedCompetencyUUID;

    let attributeTypeID = '';
    let attributeTypeUUID = '';

    attributeTypeID = this.state.attributeTypeID; //this.state.attributeTypeUUID;//
    attributeTypeUUID = this.refs.attr_ref.value;

    let title = this.refs.title.value;

    await fetch(`${apiUrl}/node?_format=hal_json`, {
      credentials: 'include',
      method: 'POST',
      cookies: 'x-access-token',
      headers: this.headers.get(),
      body: Body.mutateCompetencyName(
        competencyID,
        attributeTypeID,
        title,
        competecyUUID,
        attributeTypeUUID
      )
    });

    this.setState({ updateFlag: true });
  }

  clickToEdit(id) {
    this.setState({ selectedAttribute: id });
  }

  async handleEdit(e) {
    const aid = this.state.selectedAttribute;
    const title = e['message'];

    await fetch(`${apiUrl}/node/${aid}?_format=hal_json`, {
      method: 'PATCH',
      cookies: 'x-access-token',
      headers: this.headers.get(),
      body: Body.mutateAttribute('title', title)
    });

    this.setState({ updateFlag: true });
  }

  async toggleArchive(aid, isArchived) {
    await fetch(`${apiUrl}/node/${aid}?_format=hal_json`, {
      method: 'PATCH',
      cookies: 'x-access-token',
      headers: this.headers.get(),
      body: Body.mutateAttribute('field_archived', !isArchived)
    });

    this.setState({ updateFlag: true });
  }

  onSelectChange(e) {
    let index = e.target.selectedIndex;
    let optionElement = e.target.childNodes[index];
    let option = optionElement.getAttribute('data-id');
    this.setState({ attributeTypeID: option });
  }

  render() {
    this.checkUser();

    let selectedCompetency = this.state.path[5].toLowerCase();
    let attributeTypeOptions = [];
    let frameworkName = '';
    let frameworkDefs = [];

    this.state.frameworkDetails.map((item, ikey) => {
      if (item.name.toLowerCase() === this.state.path[2]) {
        frameworkName = item.name;
        item.attribute_types.forEach(attribute_type => {
          frameworkDefs.push(attribute_type.title);
          attributeTypeOptions.push(
            <option data-id={attribute_type.id} value={attribute_type.uuid}>
              {attribute_type.title}
            </option>
          );
        });
      }
      return null;
    });

    let attributesList = this.state.data.map(item =>
      item.domains.map(domain =>
        domain.competencies
          .filter((competency, id) => {
            if (competency.id === selectedCompetency) {
              this.state.selectedCompetencyUUID = competency.uuid;
              // this.setState({ selectedCompetencyUUID: competency.uuid });
              this.state.selectedCompetencyTitle = competency.title;
              // this.setState({ selectedCompetencyTitle: competency.title });
              return true;
            }
            return false;
          })
          .map(competency =>
            frameworkDefs.map(def => {
              return (
                <tbody>
                  <tr className="secondary-background white-color">
                    <td />
                    <td>
                      <strong>
                        <em>{def}</em>
                      </strong>
                    </td>
                    <td />
                  </tr>
                  {competency.attributes.map(attribute => {
                    if (attribute.type === def) {
                      return (
                        <tr>
                          <td>
                            <i className="fas fa-arrows-alt position-icon" />{' '}
                          </td>
                          <td
                            style={{ left: '20px' }}
                            className="tooltip-td"
                            onClick={() => this.clickToEdit(attribute.id)}
                          >
                            <InlineEdit
                              text={attribute.title}
                              data-id="12"
                              staticElement="div"
                              paramName="message"
                              change={e => this.handleEdit(e)}
                              style={{
                                display: 'inline-block',
                                margin: 0,
                                padding: 5,
                                border: 1,
                                width: '100%',
                                fontSize: '110%'
                              }}
                            />
                          </td>
                          <td>
                            {attribute.archived === '1' ? (
                              <a
                                onClick={() =>
                                  this.toggleArchive(attribute.id, true)
                                }
                              >
                                <span className="fas fa-toggle-on" />
                                <span>Archived</span>
                              </a>
                            ) : (
                              <a
                                onClick={() =>
                                  this.toggleArchive(attribute.id, false)
                                }
                              >
                                <span className="fas fa-toggle-off" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              );
            })
          )
      )
    );

    return (
      <div>
        <div className="row">
          <div className="column large-12">
            <h3>Manage attributes</h3>
            <h4>
              <a
                href={
                  '/competency-mapper/#/framework/' +
                  frameworkName +
                  '/manage/competencies'
                }
              >
                {' '}
                {frameworkName}
              </a>{' '}
              / {this.state.selectedCompetencyTitle}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="column 12 callout">
            <h4>Create new attribute</h4>
            <form onSubmit={() => this.handleSubmit()}>
              <div className="row">
                <div className="column large-7">
                  <input
                    type="text"
                    ref="title"
                    placeholder="Attribute description"
                  />
                </div>
                <div className="column large-3">
                  <select
                    ref="attr_ref"
                    onChange={this.onSelectChange.bind(this)}
                  >
                    {attributeTypeOptions}
                  </select>
                </div>
                <div className="column large-2">
                  <input type="submit" className="button" value="Submit" />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="column large-12">
            <table>{attributesList}</table>
          </div>
        </div>
      </div>
    );
  }
}

const ManageAttributes = () => (
  <Switch>
    <Route
      exact
      path="/framework/:name/manage/competencies/:cid/manage-attributes"
      component={ManageAttribute}
    />
  </Switch>
);

export default ManageAttributes;
