import React from 'react';

import { apiUrl } from '../services/competency/competency';

class AttributeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valuesAttribute: [''],
      valuesType: [''],
      valuesTypeID: [''],
      selectedAttributeType: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createUI() {
    return this.state.valuesAttribute.map((el, i) => {
      if (i === 0) {
        return (
          <div key={i} className="row">
            <div className="column large-8">
              <input
                type="text"
                id={'title' + i}
                ref={'title' + i}
                required
                placeholder="Attribute description"
                value={el || ''}
                onChange={this.handleAttributeChange.bind(this, i)}
              />
            </div>
            <div className="column large-3">
              <select onChange={this.handleTypeChange.bind(this, i)}>
                {this.props.attributeTypeOptions}
              </select>
            </div>
            <div className="column large-1" />
          </div>
        );
      } else {
        return (
          <div key={i} className="row">
            <div className="column large-8">
              <input
                type="text"
                id={'title' + i}
                ref={'title' + i}
                required
                placeholder="Attribute description"
                value={el || ''}
                onChange={this.handleAttributeChange.bind(this, i)}
              />
            </div>
            <div className="column large-3">
              <select onChange={this.handleTypeChange.bind(this, i)}>
                {this.props.attributeTypeOptions}
              </select>
            </div>
            <div className="column large-1">
              <a
                type="button"
                className="button"
                onClick={this.removeClick.bind(this, i)}
              >
                {' '}
                <i className="icon icon-functional" data-icon="x" />
              </a>
            </div>
          </div>
        );
      }
    });
  }

  handleAttributeChange(i, event) {
    let valuesAttribute = [...this.state.valuesAttribute];
    valuesAttribute[i] = event.target.value;
    this.setState({ valuesAttribute });
  }

  handleTypeChange(i, event) {
    let valuesType = [...this.state.valuesType];
    valuesType[i] = event.target.value;
    this.setState({ valuesType });

    let index = event.target.selectedIndex;
    let optionElement = event.target.childNodes[index];
    let option = optionElement.getAttribute('data-id');
    this.setState({ valuesTypeID: option });
    //alert(this.state.valuesType);
  }

  addClick() {
    this.setState(prevState => ({
      valuesAttribute: [...prevState.valuesAttribute, '']
    }));
    this.setState(prevState => ({ valuesType: [...prevState.valuesType, ''] }));
  }

  removeClick(i) {
    let valuesAttribute = [...this.state.valuesAttribute];
    valuesAttribute.splice(i, 1);
    this.setState({ valuesAttribute });

    let valuesType = [...this.state.valuesType];
    valuesType.splice(i, 1);
    this.setState({ valuesType });
  }

  handleSubmit(event) {
    let attributes = this.state.valuesAttribute;

    let competencyID = this.props.selectedCompetencyID;
    let competecyUUID = this.props.selectedCompetencyUUID;

    let attributeTypeID = '';
    let attributeTypeUUID = '';

    attributes.forEach((item, i) => {
      attributeTypeID = this.state.valuesTypeID[i];
      attributeTypeUUID = this.state.valuesType[i];
      fetch(`${apiUrl}/node?_format=hal_json`, {
        method: 'POST',
        cookies: 'x-access-token',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': 'O1YI90dygefMwzYqQbEavAs7poklc9lLXCL8MwXYdaQ',
          Authorization: 'Basic'
        },
        body: JSON.stringify({
          _links: {
            type: {
              href: `${apiUrl}/rest/type/node/attribute`
            },
            [`${apiUrl}/rest/relation/node/attribute/field_competency`]: {
              href: `${apiUrl}/node/` + competencyID + '?_format=hal_json'
            },
            [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: {
              href: `${apiUrl}/node/` + attributeTypeID + '?_format=hal_json'
            }
          },
          title: [
            {
              value: item
            }
          ],
          type: [
            {
              target_id: 'attribute'
            }
          ],

          _embedded: {
            [`${apiUrl}/rest/relation/node/attribute/field_competency`]: [
              {
                _links: {
                  self: {
                    href: `${apiUrl}/node/` + competencyID + '?_format=hal_json'
                  },
                  type: {
                    href: `${apiUrl}/rest/type/node/competency`
                  }
                },
                uuid: [
                  {
                    value: competecyUUID //"b20064ef-5cbf-4147-90f8-08e7a6693e17"
                  }
                ],
                lang: 'en'
              }
            ],

            [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: [
              {
                _links: {
                  self: {
                    href:
                      `${apiUrl}/node/` + attributeTypeID + '?_format=hal_json'
                  },
                  type: {
                    href: `${apiUrl}/rest/type/node/attribute_type`
                  }
                },
                uuid: [
                  {
                    value: attributeTypeUUID
                  }
                ],
                lang: 'en'
              }
            ]
          }
        })
      });
    });

    event.preventDefault();
  }

  onSelectChange(e) {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index];
    var option = optionElement.getAttribute('data-id');
    this.setState({ selectedDomainID: option });
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="column large-12">
              <h4>Competency: {this.props.selectedCompetencyTitle}</h4>
            </div>
          </div>

          {this.createUI()}
          <div className="row">
            <div className="column large-9">
              <a
                type="button"
                className="button"
                value="add more"
                onClick={this.addClick.bind(this)}
              >
                {' '}
                <i className="icon icon-functional" data-icon="+">
                  {' '}
                </i>{' '}
                Add more{' '}
              </a>{' '}
              <br />
              <input type="submit" className="button" value="Submit" />
            </div>
            <div className="column large-3" />
          </div>
        </form>
      </div>
    );
  }
}

export default AttributeForm;
