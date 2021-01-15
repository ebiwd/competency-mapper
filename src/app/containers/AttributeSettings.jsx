import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompetencyList from './CompetencyList';
import { apiUrl } from '../services/http/http';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

class AttributeSettings extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      path: this.props.location.pathname.split('/'),
      attributeID: this.props.location.pathname.split('/')[6],
      frameworkName: this.props.location.pathname.split('/')[2],
      frameworkList: [],
      attributeType: '',
      attribute: '',
      competencyID: this.props.location.pathname.split('/')[4],
      competencyUUID: '',
      competencyTitle: '',
      attributeTypeID: '',
      attributeTypeUUID: '',
      frameworkData: []
    };

    this.changeSettings = this.changeSettings.bind(this);
    this.handleCompetencyChange = this.handleCompetencyChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  async fetchData() {
    // Load the attribute

    let attributeID = this.state.attributeID;
    let url =
      `${apiUrl}/node/` +
      attributeID +
      `/?_format=json&timestamp=${Date.now()}`;
    fetch(url)
      .then(result => result.json())
      .then(findresponse => {
        this.setState({ attribute: findresponse });
      });

    // Load all domains of all frameworks from version_manager API
    fetch(`${apiUrl}/api/version_manager?_format=json`)
      .then(result => result.json())
      .then(findresponse => {
        this.setState({ frameworkList: findresponse });
      });

    let result = await this.competencyService.getVersionedDraftFramework(
      this.state.frameworkName
    );
    this.setState({ frameworkData: result });
  }

  componentDidMount() {
    this.fetchData();
  }

  changeSettings(e) {
    let attributeID = this.state.attributeID;
    let selectedCompetencyID = this.state.competencyID
      ? this.state.competencyID
      : this.state.attribute.field_competency[0].target_id;
    let selectedCompetencyUUID = this.state.competencyUUID
      ? this.state.competencyUUID
      : this.state.attribute.field_competency[0].target_uuid;
    let selectedAttributeTypeID = this.state.attributeTypeID
      ? this.state.attributeTypeID
      : this.state.attribute.field_attribute_type[0].target_id;
    let selectedAttributeTypeUUID = this.state.attributeTypeUUID
      ? this.state.attributeTypeUUID
      : this.state.attribute.field_attribute_type[0].target_uuid;

    // console.log("competencyID: "+selectedCompetencyID + " attributeTypeID: "+ selectedAttributeTypeID);
    // if(!selectedCompetencyID){
    //   selectedCompetencyID = this.state.attribute.field_competency[0].target_id;
    //   selectedCompetencyUUID = this.state.competency.field_competency[0].target_uuid;
    // }

    // if(!selectedAttributeTypeID){
    //   selectedAttributeTypeID = this.state.attribute.field_attribute_type[0].target_id;
    //   selectedAttributeTypeUUID = this.state.competency.field_attribute_type[0].target_uuid;
    // }

    this.competencyService.changeAttributeSettings(
      attributeID,
      selectedCompetencyID,
      selectedCompetencyUUID,
      selectedAttributeTypeID,
      selectedAttributeTypeUUID
    );

    this.props.history.push(
      '/framework/' +
        this.state.path[2] +
        '/manage/competencies/' +
        this.props.location.pathname.split('/')[4] +
        '/manage-attributes'
    );
    e.preventDefault();
  }

  handleCompetencyChange(event) {
    let dataset = event.target.options[event.target.selectedIndex].dataset;
    this.setState({ competencyID: dataset.id, competencyUUID: dataset.uuid });
    //console.log(dataset.uuid);
  }

  handleTypeChange(event) {
    let dataset = event.target.options[event.target.selectedIndex].dataset;
    this.setState({
      attributeTypeID: dataset.id,
      attributeTypeUUID: dataset.uuid
    });
    //console.log(dataset.uuid);
  }

  render() {
    let attribute_title = '';
    let competency_id = '';
    let competency_uuid = '';
    let competency_title = '';
    let attribute_type_id = '';
    let attribute_type_uuid = '';
    let attribute_type_title = '';
    let attribute = this.state.attribute;
    let frameworkData = this.state.frameworkData;
    let frameworkList = this.state.frameworkList;
    let competencyOptions = [];
    let competencyArray = [];
    let attributeTypeOptions = [];
    let attributeTypeArray = [];

    //console.log(frameworkList);

    if (frameworkList) {
      frameworkList.map(framework => {
        if (framework.title.toLowerCase() == this.state.frameworkName) {
          framework.attribute_types.map(attribute_type => {
            attributeTypeOptions.push(
              <option
                key={attribute_type.id}
                data-id={attribute_type.id}
                data-uuid={attribute_type.uuid}
                value={attribute_type.id}
              >
                {attribute_type.title}
              </option>
            );
            attributeTypeArray.push({
              key: attribute_type.id,
              value: attribute_type.title
            });
          });
        }
      });
      //console.log(attributeTypeArray);
    }

    if (frameworkData) {
      frameworkData.map(framework => {
        framework.domains.map(domain => {
          domain.competencies.map(competency => {
            if (competency.archived == 0) {
              competencyOptions.push(
                <option
                  key={competency.id}
                  data-id={competency.id}
                  data-uuid={competency.uuid}
                  value={competency.id}
                >
                  {competency.title}
                </option>
              );
              competencyArray.push({
                key: competency.id,
                value: competency.title
              });
            }
          });
        });
      });
    }

    if (attribute) {
      attribute_title = attribute.title[0].value;
      competency_id = attribute.field_competency[0].target_id;
      competency_uuid = attribute.field_competency[0].target_uuid;
      attribute_type_id = attribute.field_attribute_type[0].target_id;
      if (competencyArray.length > 0) {
        let obj = competencyArray.find(d => d.key == competency_id);
        competency_title = obj.value;
        //console.log(attribute_type_id);
      }

      if (attributeTypeArray.length > 0) {
        let obj = attributeTypeArray.find(d => d.key == attribute_type_id);
        attribute_type_title = obj.value;
      }

      //console.log(attribute_title);
    }

    return (
      <div>
        <h2>Change attribute settings</h2>
        <h3>Attribute: {attribute_title}</h3>
        <table className="table hover stack">
          <tbody>
            <tr>
              <td>Competency:</td>
              <td>{competency_title}</td>
              <td rowSpan={2}>
                <form
                  id={'changeDomainForm'}
                  onSubmit={this.changeSettings.bind(this)}
                >
                  <label>Change competency:</label>
                  <select
                    value={
                      this.state.competencyID
                        ? this.state.competencyID
                        : competency_id
                    }
                    onChange={this.handleCompetencyChange}
                  >
                    {competencyOptions}
                  </select>
                  <label>Change attribute type:</label>
                  <select
                    value={
                      this.state.attributeTypeID
                        ? this.state.attributeTypeID
                        : attribute_type_id
                    }
                    onChange={this.handleTypeChange}
                  >
                    {attributeTypeOptions}
                  </select>
                  <input type="submit" className="button" value="Save" />
                </form>
              </td>
            </tr>

            <tr>
              <td>Attribute type:</td>
              <td>{attribute_type_title}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const AttributeSettingsRoot = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/competency/:cid/attribute/:aid/settings"
      component={AttributeSettings}
    />
  </Switch>
);

export default AttributeSettingsRoot;
