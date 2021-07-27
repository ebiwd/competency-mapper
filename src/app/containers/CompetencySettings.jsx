import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import Collapsible from 'react-collapsible';
// import ReactModal from 'react-modal';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import CompetencyList from './CompetencyList';
import { apiUrl } from '../services/http/http';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

class CompetencySettings extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      path: this.props.location.pathname.split('/'),
      competency: '',
      competencyUUID: '',
      competencyTitle: '',
      frameworkList: [],
      domainID: '',
      domainUuid: '',
      csrf: '',
      mapping: ''
    };

    this.editDomain = this.editDomain.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  async fetchData() {
    let competencyID = this.state.path[4];
    let url = `${apiUrl}/node/` + competencyID + `/?_format=json`;
    fetch(url)
      .then(result => result.json())
      .then(findresponse => {
        this.setState({ competency: findresponse }, this.setMappingText);
      });

    // Load all domains of all frameworks from version_manager API

    let versoinManagerURL = `${apiUrl}/api/version_manager/?_format=json&timestamp=${Date.now()}`;
    fetch(versoinManagerURL)
      .then(result => result.json())
      .then(findresponse => {
        this.setState({ frameworkList: findresponse });
      });

    //console.log(apiUrl);
  }

  async setMappingText() {
    let competency = this.state.competency;
    if (competency.field_map_other_competency.length > 0) {
      this.setState({
        mapping: competency.field_map_other_competency[0].value
      });
    }
  }

  componentDidMount() {
    this.fetchData();
    //await this.setMappingText();
  }

  editDomain(e) {
    let competencyID = this.state.path[4];
    let selectedDomainID = this.state.domainID;
    let selectedDomainUUID = this.state.domainUuid;
    let mapping = this.state.mapping;
    if (!selectedDomainID) {
      selectedDomainID = this.state.competency.field_domain[0].target_id;
      selectedDomainUUID = this.state.competency.field_domain[0].target_uuid;
    }
    this.competencyService.changeDomain(
      competencyID,
      selectedDomainID,
      selectedDomainUUID,
      mapping
    );
    //console.log("editDomain() called");
    this.props.history.push(
      '/framework/' + this.state.path[2] + '/manage/competencies'
    );
    e.preventDefault();
  }

  onTextChange(event) {
    this.setState({ mapping: event.target.value });
    //console.log(this.state.mapping);
  }

  handleChange(event) {
    let dataset = event.target.options[event.target.selectedIndex].dataset;
    this.setState({ domainID: dataset.id, domainUuid: dataset.uuid });
    //console.log(dataset.uuid);
  }

  render() {
    let competency_title = '';
    let domain_id = '';
    //let domain_uuid = '';
    let domain_title = '';
    let competency = this.state.competency;
    let frameworkList = this.state.frameworkList;
    let domainOptions = [];
    let domainArray = [];
    //let mapped_other_competency = "";

    if (frameworkList.length > 0) {
      console.log(this.state.frameworkList);
      frameworkList.map(framework => {
        if (framework.title.toLowerCase() === this.state.path[2]) {
          framework.domains.map(domain => {
            domainOptions.push(
              <option
                key={domain.id}
                data-id={domain.id}
                data-uuid={domain.uuid}
                value={domain.id}
              >
                {domain.title}
              </option>
            );
            domainArray.push({ key: domain.id, value: domain.title });
            return null;
          });
        }
        return null;
      });
    }

    if (competency) {
      competency_title = competency.title[0].value;
      domain_id = competency.field_domain[0].target_id;
      //domain_uuid = competency.field_domain[0].target_uuid;
      if (domainArray.length > 0) {
        let obj = domainArray.find(d => d.key === domain_id);
        domain_title = obj.value;
      }
    }

    return (
      <div>
        <h2>Change domain</h2>
        <table className="table hover stack">
          <tbody>
            <tr>
              <td>
                <h4>Domain:</h4>
              </td>
              <td>
                <h4>{domain_title}</h4>
              </td>
            </tr>
            <tr>
              <td>
                <h4>Competency:</h4>
              </td>
              <td>
                <h4>{competency_title}</h4>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <p className="lead">
                  Select the domain from the following list to change:
                </p>
                <form
                  id={'changeDomainForm'}
                  onSubmit={this.editDomain.bind(this)}
                >
                  <div className="row">
                    <div className="column large-11">
                      <select
                        value={
                          this.state.domainID ? this.state.domainID : domain_id
                        }
                        onChange={this.handleChange}
                      >
                        {domainOptions}
                      </select>
                      <label>
                        Maps to competency/attribute from other framework
                        <input
                          type="text"
                          placeholder="Framework (version), competency or attribute"
                          name="mapping"
                          value={this.state.mapping}
                          onChange={this.onTextChange.bind(this)}
                        />
                      </label>
                      <input type="submit" className="button" value="Save" />
                    </div>
                    <div className="column large-1" />
                  </div>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const CompetencySettingsRoot = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/competency/:id/settings"
      component={CompetencySettings}
    />
  </Switch>
);

export default CompetencySettingsRoot;
