import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';

import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat } from '../services/util/util';

class ManageAttributes extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  state = {
    framework: '',
    frameworkName: '',

    domainName: '',
    domainId: '',

    competencyId: '',
    competencyName: '',
    competencyData: [],
    competencyUuid: '',
    attributeTypes: [],

    // form properties to create new attributes
    newAttribute: '',
    newAttributeTypeUuid: ''
  };

  constructor(props) {
    super(props);
    this.state.framework = props.match.params.framework.toLowerCase();
    this.state.competencyId = props.match.params.cid;
  }

  async componentWillMount() {
    window.scroll(0, 0);
    this.activeRequests.startRequest();
    const promise1 = this.fetchCompetency();
    const promise2 = this.fetchFramework();
    await promise1;
    await promise2;
    this.activeRequests.finishRequest();
  }

  filterByCompetencyId(data, id) {
    return safeFlat(
      data.map(item =>
        safeFlat(
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
    const { framework } = this.state;

    const frameworkData = await this.competencyService.getFramework(framework);
    const competencyMatch = this.filterByCompetencyId(
      frameworkData,
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
    const { framework } = this.state;
    const frameworkData = await this.competencyService.getAllFrameworks();
    const frameworkMatch = frameworkData.filter(
      item => item.name.toLowerCase() === framework
    );

    if (frameworkMatch.length) {
      this.setState({
        frameworkName: frameworkMatch[0].name,
        attributeTypes: frameworkMatch[0].attribute_types,
        newAttributeTypeUuid: frameworkMatch[0].attribute_types[0].uuid
      });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    const {
      newAttribute: description,
      newAttributeTypeUuid: attributeTypeUuid,
      competencyId,
      attributeTypes,
      competencyUuid
    } = this.state;

    if (description === '' || attributeTypeUuid === '') {
      return;
    }
    const attributeTypeId = attributeTypes.filter(
      item => item.uuid === attributeTypeUuid
    )[0].id;

    this.activeRequests.startRequest();
    await this.competencyService.createCompetency({
      description,
      attributeTypeId,
      attributeTypeUuid,
      competencyId,
      competencyUuid
    });

    this.setState({
      newAttribute: '',
      newAttributeTypeUuid: attributeTypes[0].uuid
    });
    await this.fetchCompetency();
    this.activeRequests.finishRequest();
  };

  async handleEdit(attributeId, { message: title }) {
    this.activeRequests.startRequest();
    await this.competencyService.patchAttribute(attributeId, 'title', title);
    await this.fetchCompetency();
    this.activeRequests.finishRequest();
  }

  async toggleArchive(attributeId, isArchived) {
    this.activeRequests.startRequest();
    await this.competencyService.patchAttribute(
      attributeId,
      'field_archived',
      isArchived === '1' ? false : true
    );
    await this.fetchCompetency();
    this.activeRequests.finishRequest();
  }

  onChange = ({ currentTarget: control, target }) => {
    this.setState({ [control.name]: target.value });
  };

  getTableRows(def, parentIndex) {
    const competency = this.state.competencyData;

    if (competency.length === 0) {
      return null;
    }

    return competency.attributes
      .filter(attribute => attribute.type === def.title)
      .map((attribute, index) => {
        return (
          <tr key={attribute.uuid}>
            <td>{`${parentIndex}.${index + 1}`}</td>
            <td>
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
              <button
                className="cursor"
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
              </button>
            </td>
          </tr>
        );
      });
  }

  getAttributeList() {
    return this.state.attributeTypes.map((def, index) => (
      <tbody key={def.uuid}>
        <tr className="secondary-background white-color">
          <td>{index + 1}</td>
          <td>
            <strong>
              <em>{def.title}</em>
            </strong>
          </td>
          <td className="small-1">Archive</td>
        </tr>
        {this.getTableRows(def, index + 1)}
      </tbody>
    ));
  }

  render() {
    const {
      framework,
      frameworkName,
      domainName,
      domainId,
      competencyName,
      attributeTypes,
      newAttribute,
      newAttributeTypeUuid
    } = this.state;

    const selectOptions = attributeTypes.map(option => (
      <option key={option.uuid} value={option.uuid}>
        {option.title}
      </option>
    ));

    return (
      <div className="row">
        <h2>Manage attributes</h2>
        <h4>
          <Link to={`/framework/${framework}/manage/competencies`}>
            {frameworkName}
          </Link>
          {' / '}
          <Link to={`/framework/${framework}/manage/competencies/${domainId}`}>
            {domainName}
          </Link>
          {' / '}
          {competencyName}
        </h4>

        <div className="callout">
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

        <table>{this.getAttributeList()}</table>
      </div>
    );
  }
}

export default ManageAttributes;
