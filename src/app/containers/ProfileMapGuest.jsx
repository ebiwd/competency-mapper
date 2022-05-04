import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';

import { Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import user_icon from './user_icon.png';

import ReactTooltip from 'react-tooltip';
import jsonData from './masterList.json';

const $ = window.$;

export const ProfileMapGuest = props => {
  const profileService = new ProfileService();

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  const [mapping, setMapping] = useState();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  var competencyForm = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var expertise_not_applicable = '';
  var attribute_types = [];
  var frameworkFullName = '';

  useEffect(() => {
    const fetchData = async () => {
      const storedProfile = JSON.parse(localStorage.getItem('guestProfile'));
      if (storedProfile) {
        setProfile(storedProfile);
        setMapping(
          storedProfile.profile_mapping ? storedProfile.profile_mapping : []
        );
      }

      await fetch(
        `${apiUrl}/api/version_manager?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });
      console.log(apiUrl);

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });
    };
    // fetchData();

    if (!mapping) {
      fetchData();
    }

    // if (mapping) {
    //   let checkBoxes = $('input:checkbox');
    //   checkBoxes.each(function(index, item, arr) {
    //     console.log('test ' + item.dataset);
    //   });
    // }
  }, [frameworkName, frameworkVersion, mapping]);

  const handleSubmit = async e => {
    e.preventDefault();

    let response = await profileService.mapProfileGuest(mapping);
    console.log(response);
    props.history.push(
      `/framework/${frameworkName}/${frameworkVersion}/profile/view/guest`
    );
  };

  const handleSelect = event => {
    let competency_id = event.target[event.target.selectedIndex].getAttribute(
      'data-competency'
    );
    let expertise_id = event.target[event.target.selectedIndex].getAttribute(
      'data-expertise'
    );
    let tempMapping = mapping;

    let attributesList = [];
    let checkBoxes = $('input:checkbox[data-competency=' + competency_id + ']');

    if (expertise_id === expertise_not_applicable) {
      checkBoxes.each(function(index, item, arr) {
        item.checked = false;
        item.disabled = true;
      });
      //console.log(tempMapping.find(o => o.competency == competency_id))
      // tempMapping.splice(
      //   tempMapping.find(o => o.competency == competency_id),
      //   1
      // );
      console.log(tempMapping);
      // Remove the NA competency from the temp array
      tempMapping = tempMapping.filter(o => o.competency !== competency_id);
      console.log(tempMapping);
    } else if (tempMapping) {
      if (tempMapping.find(o => o.competency === competency_id)) {
        let o = tempMapping.find(o => o.competency === competency_id);
        o.expertise = expertise_id;

        checkBoxes.each(function(index, item, arr) {
          attributesList.push(item.id);
          item.checked = true;
          item.disabled = false;
        });
        o.attributes = attributesList;
      } else {
        checkBoxes.each(function(index, item, arr) {
          attributesList.push(item.id);
          item.checked = true;
          item.disabled = false;
        });
        tempMapping.push({
          competency: competency_id,
          expertise: expertise_id,
          attributes: attributesList
        });
      }
    }
    setMapping(tempMapping);
  };

  const handleCheckBox = e => {
    let checkboxStatus = e.target.checked;
    let competency_id = e.target.dataset.competency;
    let tempMapping = mapping;
    if (tempMapping) {
      if (checkboxStatus === true) {
        e.target.checked = true;
        let o = tempMapping.find(o => o.competency === competency_id);
        o.attributes.push(e.target.id);
      } else {
        let o = tempMapping.find(o => o.competency === competency_id);
        o.attributes.splice(o.attributes.indexOf(e.target.id), 1);
      }
      setMapping(tempMapping);
    }
    console.log(mapping);
  };

  const generateForm = () => {
    if (frameworkInfo) {
      frameworkInfo.forEach(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          //frameworkLogo = info.logo[0].url;
          //frameworkDesc = info.description;
          info.expertise_levels.map(
            (level, levelIndex) => (
              (expertise_levels[level.id] = level.title),
              level.title === 'Not applicable'
                ? (expertise_not_applicable = level.id)
                : '',
              expertise_levels_legend.push(
                <li
                  key={levelIndex}
                  className="vf-list__item"
                  style={{ textAlign: 'center' }}
                >
                  <div
                    data-tip={level.description ? level.description : 'NA'}
                    data-html={true}
                    data-type="info"
                    data-multiline={true}
                  >
                    <span className="vf-badge vf-badge--tertiary">
                      {' '}
                      {level.rating_level}{' '}
                    </span>{' '}
                    <span> {level.title}</span>
                  </div>
                  <ReactTooltip className="tooltip-custom" />
                </li>
              )
            )
          );
        }
      });
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          info.attribute_types.map(
            attribute => (attribute_types[attribute.id] = attribute.title)
          );
        }
        return null;
      });
    }

    if (framework) {
      competencyForm = framework.map(item =>
        item.domains.map((domain, did) => (
          <ul key={`ul${did}`}>
            <li key={did} className="domain_list">
              <div className="row callout">
                <div className="column medium-9">
                  <h5 className="domain_title"> {domain.title}</h5>
                </div>
              </div>
              <ul>
                {domain.competencies.map((competency, cid) => (
                  <li key={cid} className="competency_list">
                    <div className="vf-grid vf-grid__col-4">
                      <div className="vf-grid__col--span-3">
                        <Collapsible
                          trigger={
                            <div className="open-close-title">
                              <span className="icon icon-common icon-angle-right icon-custom">
                                {' '}
                              </span>
                              <span>{competency.title}</span>
                            </div>
                          }
                          triggerWhenOpen={
                            <div className="open-close-title">
                              <span className="icon icon-common icon-angle-down icon-custom">
                                {' '}
                              </span>
                              <span>{competency.title}</span>
                            </div>
                          }
                        >
                          <ul>
                            {attribute_types.map(
                              (attribute_type, typeIndex) => {
                                return (
                                  <li
                                    key={typeIndex}
                                    className="attribute_type"
                                  >
                                    {attribute_type}
                                    <ul>
                                      {competency.attributes
                                        .filter(
                                          attribute =>
                                            attribute.type === attribute_type
                                        )
                                        .map((attribute, attrIndex) => (
                                          <li
                                            key={attrIndex}
                                            className="attribute_title"
                                          >
                                            <div className="vf-grid vf-grid__col-4">
                                              <div className="vf-grid__col--span-1">
                                                <input
                                                  type="checkbox"
                                                  id={attribute.id}
                                                  onChange={e =>
                                                    handleCheckBox(e)
                                                  }
                                                  defaultChecked={
                                                    mapping
                                                      ? mapping.find(o =>
                                                          o.attributes.find(
                                                            a =>
                                                              a === attribute.id
                                                          )
                                                        )
                                                        ? true
                                                        : false
                                                      : false
                                                  }
                                                  disabled={
                                                    mapping
                                                      ? mapping.find(
                                                          o =>
                                                            o.competency ===
                                                            competency.id
                                                        )
                                                        ? false
                                                        : true
                                                      : true
                                                  }
                                                  data-competency={
                                                    competency.id
                                                  }
                                                />
                                              </div>
                                              <div className="vf-grid__col--span-3">
                                                <label
                                                  className="attribute_label"
                                                  htmlFor={attribute.id}
                                                >
                                                  {' '}
                                                  {attribute.title}
                                                </label>
                                              </div>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </Collapsible>
                      </div>
                      <div className="vf-grid__col--span-1">
                        <select
                          onChange={e => handleSelect(e)}
                          defaultValue={
                            mapping
                              ? mapping.find(
                                  o => o.competency === competency.id
                                )
                                ? mapping.find(
                                    o => o.competency === competency.id
                                  ).expertise
                                : expertise_not_applicable
                              : expertise_not_applicable
                          }
                          className="vf-form__select"
                        >
                          {expertise_levels.map((key, value) => (
                            <option
                              key={value}
                              value={value}
                              data-expertise={value}
                              data-competency={competency.id}
                            >
                              {key}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        ))
      );
    }
  };

  return (
    <div>
      {generateForm()}
      {profile ? (
        <div key={'div123'}>
          <div key={'div567'} className="row">
            <div className="vf-u-margin__top--400" />
            <h2> Competency mapping</h2>
            <h3>
              {jsonData.filter(item => item.title === frameworkName)[0].desc} (
              {frameworkFullName} {frameworkVersion}) - {profile.job_title}{' '}
            </h3>

            <div key={'div350'} className="column medium-12">
              <div className="vf-grid vf-grid__col-5">
                <div className="vf-grid__col--span-4" />
                <div className="vf-grid__col--span-1">
                  <Link
                    to={`/framework/${frameworkName}/${frameworkVersion}/profile/view/guest`}
                  >
                    <i className="icon icon-common icon-angle-left" /> Profile
                    overview
                  </Link>
                  <p />
                </div>
              </div>

              <div className="vf-grid vf-grid__col-4">
                <div className="vf-grid__col--span-1">
                  <img
                    src={profile.image[0] ? profile.image[0].url : user_icon}
                    width="150px"
                    alt=""
                  />
                </div>
                <div className="vf-grid__col--span-3 form_intro">
                  <p>
                    Hi Guest. The form below is listing competencies from{' '}
                    {frameworkFullName} competency framework. A competency is an
                    observable ability of any professional, integrating multiple
                    components such as knowledge, skills and behaviours. A
                    competency profile lists and defines all the competencies
                    that an individual might need to fulfil a particular role,
                    or that define specific user groups.
                  </p>
                </div>
              </div>
              <div className="vf-grid vf-grid__col-4">
                <div className="vf-grid__col--span-1">
                  {' '}
                  <h5 style={{ marginTop: '25px' }}>
                    {frameworkFullName} {frameworkVersion} / Competencies
                  </h5>
                </div>
                <div className="vf-grid__col--span-3">
                  <ul
                    className="vf-list legend-inline"
                    style={{ float: 'right' }}
                  >
                    {expertise_levels_legend}
                  </ul>
                </div>
              </div>
              <hr />

              <div className="competency_section">
                {
                  <form key={profile.id} onSubmit={e => handleSubmit(e)}>
                    {competencyForm}
                    <div className="submit_fixed">
                      <button
                        className="vf-button vf-button--primary vf-button--sm"
                        type="submit"
                      >
                        Save <i className="icon icon-common icon-save" />
                      </button>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export const path = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/map/guest"
      component={ProfileMapGuest}
    />
  </Switch>
);

export default path;
