import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

const $ = window.$;

class AttributeMap extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //framework: this.props.selectedFramework,
      //resourceID: this.props.resourceID,
      framework: this.props.location.pathname.split('/')[4].replace(/ /g, ''),
      framework_id: '',
      resourceID: this.props.location.pathname.split('/')[2],
      frameworkdetails: [],
      csrf: '',
      frameworkUUID: '',
      competencies: [],
      //attributes: this.props.selectedAttributes,
      //selectedAttributes: this.props.selectedAttributes,
      selectedAttributes: [],
      //selectedCompetencies: this.props.selectedCompetencies,
      resourceDetails: '',
      resourcePath: this.props.location.pathname.split('/')
    };
    this.handleSelect = this.handleSelect.bind(this);
    //this.loadSelectedAttributes = this.loadSelectedAttributes.bind(this);
  }

  async handleSelect() {
    let checkedAttributes = this.state.selectedAttributes;
    let framework_id = this.state.framework_id;
    let attributeIDs = [];
    //let token = localStorage.getItem('csrf_token');
    for (let i = 0; i < checkedAttributes.length; i++) {
      attributeIDs.push(checkedAttributes[i].split('id', 2));
    }

    try {
      this.activeRequests.startRequest();
      await Promise.all([
        this.competencyService.attrmap(
          this.state.resourceID,
          attributeIDs,
          framework_id
        )
      ]);
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
      this.props.history.push('/training-resources/' + this.state.resourceID);
    }
  }

  handleAllCheck(id, uuid, e) {
    const selectedAttributes = this.state.selectedAttributes;
    let childItems = document.getElementsByName(id);
    if (e.target.checked) {
      for (let i = 0; i < childItems.length; i++) {
        childItems[i].checked = true;
        selectedAttributes.push(
          // childItems[i].getAttribute('data-uuid') +
          //   'id' +
          childItems[i].getAttribute('data-id')
        );
        this.setState({ selectedAttributes });
      }
    } else {
      for (let i = 0; i < childItems.length; i++) {
        if (childItems[i].checked === true) {
          childItems[i].checked = false;
          //selectedAttributes.pop(childItems[i].getAttribute('data-id'));
          //let index = array.indexOf(element);
          selectedAttributes.splice(
            selectedAttributes.indexOf(childItems[i]),
            1
          );
          this.setState({ selectedAttributes });
        }
      }
    }
  }

  handleAttributeClick(id, uuid, e) {
    let selectedAttributes = this.state.selectedAttributes;
    //let selectedAttributes =
    let isChecked = e.target.checked;
    if (isChecked) {
      //selectedAttributes.push(uuid + 'id' + id);
      selectedAttributes.push(id);
      this.setState({ selectedAttributes });
      document.getElementById(e.target.name).checked = true;
    } else {
      //selectedAttributes.pop(id);
      selectedAttributes.splice(selectedAttributes.indexOf(id), 1);
      this.setState({ selectedAttributes });
      if (!$(':checkbox[name=' + e.target.name + ']').is(':checked')) {
        document.getElementById(e.target.name).checked = false;
      }
    }
  }

  handleListAllChecked(e) {
    let lists = [];
    $(':checkbox').each(function() {
      if ($(this).is(':checked')) {
        lists.push($(this).attr('id'));
      }
    });
    alert(lists);
  }

  async componentDidMount() {
    await fetch(
      `${apiUrl}` +
        '/api/resources/?_format=hal_json&id=' +
        this.state.resourceID +
        '&timestamp=' +
        Date.now()
    )
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          resourceDetails: findresponse
        });
      });

    console.log(this.state.resourceDetails);

    let selectedAttributes = [];
    this.state.resourceDetails.competency_profile.map(profile => {
      //if(profile.title.toLowerCase() == this.state.framewor  k){
      profile.domains.map(domain => {
        domain.competencies.map(competency => {
          competency.attributes.map(attribute => {
            selectedAttributes.push(attribute.id);
            return null;
          });
          return null;
        });
        return null;
      });
      //}
      return null;
    });

    this.setState({ selectedAttributes: selectedAttributes });

    //console.log(this.state.framework);
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    let fetchFrameworkDetails = `${apiUrl}/api/version_manager?_format=json&timestamp=${Date.now()}`;
    await fetch(fetchFrameworkDetails)
      .then(Response => Response.json())
      .then(findresponse1 => {
        this.setState({
          frameworkdetails: findresponse1
        });
      });

    let latest_version = '';

    this.state.frameworkdetails.map(detail => {
      if (
        detail.title.toLowerCase().replace(/ /g, '') === this.state.framework
      ) {
        detail.versions.map(version => {
          if (version.status === 'live') {
            latest_version = version.number;
            this.state.framework_id = detail.nid;
            console.log(detail.nid);
          }
          return null;
        });
      }
      return null;
    });

    console.log(latest_version);

    let fetchCompetencyList =
      `${apiUrl}` +
      '/api/' +
      this.state.framework +
      '/' +
      latest_version +
      '?_format=json';

    await fetch(fetchCompetencyList)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.attributes === nextState.attributes;
  }

  render() {
    //console.log(this.state.data);
    let frameworkDetails = this.state.frameworkdetails;
    let data = this.state.data;
    let frameworkDefs = [];
    let domainsOptions = [];
    let attributeTypeOptions = [];
    let resDetails = this.state.resourceDetails;
    //let resDetails = this.state.resourceDetails;
    let selectedAttributesArray = [];
    let selectedCompetenciesArray = [];
    if (resDetails) {
      resDetails.competency_profile.map(profile => {
        profile.domains.map(domain => {
          domain.competencies.map(competency => {
            selectedCompetenciesArray.push(competency.id);
            competency.attributes.map(attribute => {
              selectedAttributesArray.push(attribute.id);
              return null;
            });
            return null;
          });
          return null;
        });
        return null;
      });

      //console.log(selectedAttributesArray);
    }
    //this.loadSelectedAttributes();

    frameworkDetails.forEach((item, ikey) => {
      if (item.title.toLowerCase().replace(/ /g, '') === this.state.framework) {
        //this.state.frameworkUUID = item.uuid;
        item.attribute_types.forEach(attribute_type => {
          frameworkDefs.push(attribute_type.title);
          attributeTypeOptions.push(
            <option data-id={attribute_type.id} value={attribute_type.uuid}>
              {attribute_type.title}
            </option>
          );
        });
        item.domains.forEach(domain => {
          domainsOptions.push(
            <option data-id={domain.id} value={domain.uuid}>
              {domain.title}
            </option>
          );
        });
      }
    });

    // console.log(data);

    const ListOfCompetencies = data.map(item =>
      item.domains.map((domain, did) => (
        <tbody>
          <tr key={domain.nid}>
            <td>{did + 1}</td>{' '}
            <td>
              <strong> {domain.title}</strong>{' '}
            </td>{' '}
          </tr>
          {domain.competencies.map((competency, cid) => (
            <tr key={competency.id}>
              <td>
                {did + 1}.{cid + 1}
              </td>
              <td>
                <input
                  type={'checkbox'}
                  defaultChecked={
                    -1 !== selectedCompetenciesArray.indexOf(competency.id)
                  }
                  data-test={competency.uuid}
                  id={competency.id}
                  onChange={this.handleAllCheck.bind(
                    this,
                    competency.id,
                    competency.uuid
                  )}
                />{' '}
                {competency.title}
                <ul style={{ marginLeft: 1 + 'em', marginBottom: 1 + 'em' }}>
                  {frameworkDefs.map(def => {
                    return (
                      <div style={{ marginLeft: 1 + 'em' }}>
                        <div>
                          {' '}
                          <strong>
                            <em>{def}</em>
                          </strong>
                        </div>
                        {competency.attributes
                          .filter(attribute => attribute.type === def)
                          .map(attribute => {
                            return (
                              <li
                                key={attribute.id}
                                style={{ marginLeft: 1 + 'em' }}
                              >
                                <input
                                  type={'checkbox'}
                                  defaultChecked={
                                    -1 !==
                                    selectedAttributesArray.indexOf(
                                      //attribute.uuid + 'id' + attribute.id
                                      attribute.id
                                    )
                                  }
                                  name={competency.id}
                                  data-id={attribute.id}
                                  data-uuid={attribute.uuid}
                                  id={attribute.id}
                                  onChange={this.handleAttributeClick.bind(
                                    this,
                                    attribute.id,
                                    attribute.uuid
                                  )}
                                />{' '}
                                <span className={attribute.archived}>
                                  {' '}
                                  {attribute.title}
                                </span>
                              </li>
                            );
                          })}
                      </div>
                    );
                  })}
                </ul>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <td />
            </td>
          </tr>
        </tbody>
      ))
    );
    console.log(this.state.data);
    return (
      <div>
        <h2>{resDetails.title}</h2>
        <h4>Type: {resDetails.type}</h4>
        <h4>URL: {resDetails.url}</h4>
        <table className={'table'}>{ListOfCompetencies}</table>
        <div id={'footer-button'}>
          <button
            className={'vf-button vf-button--primary vf-button--sm'}
            onClick={this.handleSelect.bind(this)}
          >
            {' '}
            Save
          </button>
        </div>
      </div>
    );
  }
}

const AttrMap = () => (
  <Switch>
    <Route
      exact
      path="/training-resources/:id/map/:framework"
      component={AttributeMap}
    />
  </Switch>
);

export default AttrMap;
