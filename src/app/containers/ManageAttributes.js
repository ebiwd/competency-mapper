import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from 'react-edit-inline';

import CompetencyService from '../services/competency/compentency';

/* TODO:
 *  #. fix `Manage attributes` title in Safari (it is obfuscated by the masthead)
 *  #. fix spacing with second column (archive <-> unarchive resizes it)
 */

class ManageAttributes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      framework: props.match.params.framework,
      frameworkName: '',

      domainName: '',
      domainId: '',

      competencyId: props.match.params.cid,
      competencyName: '',
      competencyData: [],
      competencyUuid: '',
      competencyTypes: [],

      // form properties to create new attributes
      newAttribute: '',
      newAttributeTypeUuid: ''
    };

    this.competencyService = new CompetencyService();
    this.headers = new Headers();
  }

  async componentDidMount() {
    window.scroll(0,0);
    const promise1 = this.fetchCompetency();
    const promise2 = this.fetchFramework();
    await promise1;
    await promise2;
  }

  filterByCompetencyId(data, id) {
    // In modern browser (es2018), instead of `reduce` it is possible to call `flat`
    const myFlat = array =>
      Array.prototype.flat
        ? array.flat()
        : array.reduce((prev, curr) => [...prev, ...curr]);

    return myFlat(
      data.map(item =>
        myFlat(
          item.domains.map(domain =>
            domain.competencies
              .filter(competency => competency.id === id)
              .map(competency => {
                competency.domainTitle = domain.title;
                competency.domainId = domain.nid;
                return competency;
              })
          )
        )
      )
    );
  }

  async fetchCompetency() {
    const competencyData = await this.competencyService.getFramework(
      this.state.framework
    );
    const competencyMatch = this.filterByCompetencyId(
      competencyData,
      this.state.competencyId
    );

    if (competencyMatch.length) {
      this.setState({
        domainName: competencyMatch[0].domainTitle,
        domainId: competencyMatch[0].domainId,
        competencyUuid: competencyMatch[0].uuid,
        competencyName: competencyMatch[0].title,
        competencyData: competencyMatch[0]
      });
    }
  }

  async fetchFramework() {
    const frameworkData = await this.competencyService.getAllFrameworks();
    const frameworkMatch = frameworkData.filter(
      item => item.name.toLowerCase() === this.state.framework
    );

    if (frameworkMatch.length) {
      this.setState({
        frameworkName: frameworkMatch[0].name,
        competencyTypes: frameworkMatch[0].attribute_types,
        newAttributeTypeUuid: frameworkMatch[0].attribute_types[0].uuid
      });
    }
  }

  // TODO: replace this method for a router guard
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

  handleSubmit = async event => {
    event.preventDefault();

    const {
      newAttribute: description,
      newAttributeTypeUuid: attributeTypeUuid,
      competencyId,
      competencyTypes,
      competencyUuid
    } = this.state;

    if (description === '' || attributeTypeUuid === '') {
      return;
    }
    const attributeTypeId = competencyTypes.filter(
      item => item.uuid === attributeTypeUuid
    )[0].id;

    await this.competencyService.createCompetency({
      description,
      attributeTypeId,
      attributeTypeUuid,
      competencyId,
      competencyUuid
    });

    this.setState({
      newAttribute: '',
      newAttributeTypeUuid: competencyTypes[0].uuid
    });
    this.fetchCompetency();
  };

  async handleEdit(aId, { message: title }) {
    await this.competencyService.patchAttribute(aId, 'title', title);
    this.fetchCompetency();
  }

  async toggleArchive(aId, isArchived) {
    await this.competencyService.patchAttribute(
      aId,
      'field_archived',
      isArchived === '1' ? false : true
    );
    this.fetchCompetency();
  }

  onChange = ({ currentTarget: control, target }) => {
    this.setState({ [control.name]: target.value });
  };

  getTableRows(def) {
    const competency = this.state.competencyData;

    if (competency.length === 0) {
      return null;
    }

    return competency.attributes
      .filter(attribute => attribute.type === def.title)
      .map(attribute => {
        return (
          <tr key={attribute.uuid}>
            {/*
                          <td>
                            <i className="fas fa-arrows-alt position-icon" />{' '}
                          </td>
                          */}
            <td style={{ left: '20px' }} className="tooltip-td">
              <InlineEdit
                text={attribute.title}
                staticElement="div"
                paramName="message"
                change={e => this.handleEdit(attribute.id, e)}
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
              <a
                onClick={() =>
                  this.toggleArchive(attribute.id, attribute.archived)
                }
              >
                {attribute.archived === '1' ? (
                  <span className="fas fa-toggle-on">
                    <span>Archived</span>
                  </span>
                ) : (
                  <span className="fas fa-toggle-off" />
                )}
              </a>
            </td>
          </tr>
        );
      });
  }

  getAttributeList() {
    return this.state.competencyTypes.map(def => {
      return (
        <tbody key={def.uuid}>
          <tr className="secondary-background white-color">
            {/* <td /> */}
            <td>
              <strong>
                <em>{def.title}</em>
              </strong>
            </td>
            <td />
          </tr>
          {this.getTableRows(def)}
        </tbody>
      );
    });
  }

  render() {
    this.checkUser();

    const selectOptions = this.state.competencyTypes.map(option => (
      <option key={option.uuid} value={option.uuid}>
        {option.title}
      </option>
    ));

    const {
      framework,
      frameworkName,
      domainName,
      domainId,
      competencyName,
      newAttribute,
      newAttributeTypeUuid
    } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <div className="column large-12">
            <h3>Manage attributes</h3>
            <h4>
              <Link to={`/framework/${framework}/manage/competencies`}>
                {frameworkName}
              </Link>
              {' / '}
              <Link
                to={`/framework/${framework}/manage/competencies/${domainId}`}
              >
                {domainName}
              </Link>
              {' / '}
              {competencyName}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="column 12 callout">
            <h4>Create new attribute</h4>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="column large-7">
                  <input
                    type="text"
                    placeholder="Attribute description"
                    name="newAttribute"
                    value={newAttribute}
                    onChange={this.onChange}
                  />
                </div>
                <div className="column large-3">
                  <select
                    name="newAttributeTypeUuid"
                    value={newAttributeTypeUuid}
                    onChange={this.onChange}
                  >
                    {selectOptions}
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
            <table>{this.getAttributeList()}</table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ManageAttributes;
