import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';

const $ = window.$;

class AttributeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //framework: this.props.selectedFramework,
      //resourceID: this.props.resourceID,
      framework: this.props.location.pathname.split('/')[4],
      resourceID: this.props.location.pathname.split('/')[2],
      frameworkdetails: [],
      csrf: '',
      frameworkUUID: '',
      competencies: [],
      attributes: this.props.selectedAttributes,
      //selectedAttributes: this.props.selectedAttributes,
      //selectedAttributes: [],
      //selectedCompetencies: this.props.selectedCompetencies,
      resourceDetails: '',
      resourcePath: this.props.location.pathname.split('/')
    };
    this.handleSelect = this.handleSelect.bind(this);
    //this.loadSelectedAttributes = this.loadSelectedAttributes.bind(this);
  }

  handleSelect() {
    let checkedAttributes = this.state.selectedAttributes;
    let attributeIDs = [];
    let token = localStorage.getItem('csrf_token');
    for (let i = 0; i < checkedAttributes.length; i++) {
      attributeIDs.push(checkedAttributes[i].split('id', 2));
    }

    if (attributeIDs.length > 0) {
      let payload = {
        _links: {
          type: {
            href: `${apiUrl}/rest/type/node/training_resource`
          },
          [`${apiUrl}/rest/relation/node/training_resource/field_attribute_mapped`]: {
            href:
              'http://dev-competency-mapper.pantheonsite.io/node/' +
              attributeIDs[0][1] +
              '?_format=hal_json'
          }
        },

        type: [{ target_id: 'training_resource' }],
        _embedded: {}
      };

      let embedded_string = [];
      for (let i = 0; i < attributeIDs.length; i++) {
        embedded_string.push({
          _links: {
            self: {
              href: `${apiUrl}/node/` + attributeIDs[i][1] + '?_format=hal_json'
            },
            type: {
              href: `${apiUrl}/rest/type/node/attribute`
            }
          },
          uuid: [
            {
              value: attributeIDs[i][0]
            }
          ]
        });
      }

      payload._embedded = {
        [`${apiUrl}/rest/relation/node/training_resource/field_attribute_mapped`]: embedded_string
      };

      fetch(`${apiUrl}/node/` + this.state.resourceID + '?_format=hal_json', {
        credentials: 'include',
        method: 'PATCH',
        cookies: 'x-access-token',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': token,
          Authorization: 'Basic'
        },
        body: JSON.stringify(payload)
      });
    }

    this.props.handleCloseModal();
  }

  handleAllCheck(id, uuid, e) {
    const selectedAttributes = this.state.selectedAttributes;
    let childItems = document.getElementsByName(id);
    if (e.target.checked) {
      for (let i = 0; i < childItems.length; i++) {
        childItems[i].checked = true;
        selectedAttributes.push(
          childItems[i].getAttribute('data-uuid') +
            'id' +
            childItems[i].getAttribute('data-id')
        );
        this.setState({ selectedAttributes });
        console.log(this.state.selectedAttributes);
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
          console.log(this.state.selectedAttributes);
        }
      }
    }
  }

  handleAttributeClick(id, uuid, e) {
    const selectedAttributes = this.state.selectedAttributes;
    let isChecked = e.target.checked;
    if (isChecked) {
      selectedAttributes.push(uuid + 'id' + id);
      this.setState({ selectedAttributes });
      document.getElementById(e.target.name).checked = true;
      console.log(this.state.selectedAttributes);
    } else {
      //selectedAttributes.pop(id);
      selectedAttributes.splice(
        selectedAttributes.indexOf(uuid + 'id' + id),
        1
      );
      this.setState({ selectedAttributes });
      if (!$(':checkbox[name=' + e.target.name + ']').is(':checked')) {
        document.getElementById(e.target.name).checked = false;
        console.log(this.state.selectedAttributes);
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

  componentDidMount() {
    //fetch(`${apiUrl}/node/` + this.state.resourceID + '?_format=hal_json')
    fetch(
      `${apiUrl}` +
        '/api/resources/?_format=hal_json&id=' +
        this.state.resourceID
    )
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          resourceDetails: findresponse
        });
      });

    //console.log(this.state.framework);
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    let fetchCompetencyList =
      // `${apiUrl}/api/v1/framework/` + this.state.framework + '?_format=json';
      //'http://local.competency-mapper/api/bioexcel/1.0/?_format=json';
      `${apiUrl}` + '/api/' + this.state.framework + '/1.0?_format=json';
    fetch(fetchCompetencyList)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse
        });
      });

    //let fetchFrameworkDetails = `${apiUrl}/api/v1/framework?_format=json`;
    let fetchFrameworkDetails = `${apiUrl}/api/version_manager?_format=json&timestamp=${Date.now()}`;
    fetch(fetchFrameworkDetails)
      .then(Response => Response.json())
      .then(findresponse1 => {
        this.setState({
          frameworkdetails: findresponse1
        });
      });
    //this.loadSelectedAttributes();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.attributes === nextState.attributes;
  }

  render() {
    console.log(this.state.data);
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
            });
          });
        });
      });

      console.log(selectedAttributesArray);
    }
    //this.loadSelectedAttributes();

    frameworkDetails.forEach((item, ikey) => {
      if (item.title.toLowerCase() === this.state.framework) {
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

    return (
      <div>
        <h2>{resDetails.title}</h2>
        <h4>Type: {resDetails.type}</h4>
        <h4>URL: {resDetails.url}</h4>
        <table className={'table'}>{ListOfCompetencies}</table>
        <div id={'footer-button'}>
          <button className={'button'} onClick={this.handleSelect.bind(this)}>
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
