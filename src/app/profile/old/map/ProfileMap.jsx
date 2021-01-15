import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../../../services/http/http';
import ProfileService from '../../../services/profile/profile';
import ActiveRequestsService from '../../../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import user_icon from '../../../../assets/user_icon.png';
import Parser from 'html-react-parser';
import ReactTooltip from 'react-tooltip';

const $ = window.$;

export const ProfileMap = (props) => {
  const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  const [ksa, setKsa] = useState();
  const [mapping, setMapping] = useState();

  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];

  var competencyForm = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var expertise_not_applicable = '';
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';
  //var mapping = [];
  var checkboxes = [];

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profileId}&timestamp=${Date.now()}`
      )
        .then((Response) => Response.json())
        .then((findresponse) => {
          setProfile(findresponse);
        });

      await fetch(`${apiUrl}/api/version_manager?_format=json`)
        .then((Response) => Response.json())
        .then((findresponse) => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
      )
        .then((Response) => Response.json())
        .then((findresponse) => {
          setFramework(findresponse);
        });
    };
    fetchData();

    if (mapping) {
      let checkBoxes = $('input:checkbox');
      checkBoxes.each(function (index, item, arr) {
        console.log('test ' + item.dataset);
      });
    }
  }, [profileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = await profileService.mapProfile(profileId, mapping);
    console.log(response);
    props.history.push(
      `/framework/bioexcel/2.0/profile/view/${profileId}/alias`
    );
  };

  const handleSelect = (event) => {
    let competency_id = event.target[event.target.selectedIndex].getAttribute(
      'data-competency'
    );
    let expertise_id = event.target[event.target.selectedIndex].getAttribute(
      'data-expertise'
    );
    let tempMapping = mapping;

    let attributesList = [];
    let checkBoxes = $('input:checkbox[data-competency=' + competency_id + ']');

    if (expertise_id == expertise_not_applicable) {
      checkBoxes.each(function (index, item, arr) {
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
      tempMapping = tempMapping.filter((o) => o.competency != competency_id);
      console.log(tempMapping);
    } else if (tempMapping) {
      if (tempMapping.find((o) => o.competency === competency_id)) {
        let o = tempMapping.find((o) => o.competency === competency_id);
        o.expertise = expertise_id;

        checkBoxes.each(function (index, item, arr) {
          attributesList.push(item.id);
          item.checked = true;
          item.disabled = false;
        });
        o.attributes = attributesList;
      } else {
        checkBoxes.each(function (index, item, arr) {
          attributesList.push(item.id);
          item.checked = true;
          item.disabled = false;
        });
        tempMapping.push({
          competency: competency_id,
          expertise: expertise_id,
          attributes: attributesList,
        });
      }
    }
    setMapping(tempMapping);
  };

  const handleCheckBox = (e) => {
    let checkboxStatus = e.target.checked;
    let competency_id = e.target.dataset.competency;
    let tempMapping = mapping;
    if (tempMapping) {
      if (checkboxStatus == true) {
        e.target.checked = true;
        let o = tempMapping.find((o) => o.competency == competency_id);
        o.attributes.push(e.target.id);
      } else {
        let o = tempMapping.find((o) => o.competency == competency_id);
        o.attributes.splice(o.attributes.indexOf(e.target.id), 1);
      }
      setMapping(tempMapping);
    }
    console.log(mapping);
  };

  const generateForm = () => {
    if (frameworkInfo) {
      frameworkInfo.map((info) => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            (level) => (
              (expertise_levels[level.id] = level.title),
              level.title == 'Not applicable'
                ? (expertise_not_applicable = level.id)
                : ''
            )
          );
        }
      });
      frameworkInfo.map((info) => {
        if (info.title.toLowerCase() === frameworkName) {
          info.attribute_types.map(
            (attribute) => (attribute_types[attribute.id] = attribute.title)
          );
        }
      });
    }

    let index = 0;
    expertise_levels.map((level, key) => {
      expertise_levels_legend.push(
        <li style={{ textAlign: 'center' }}>
          <span className="badge secondary"> {index} </span>{' '}
          <span> {level}</span>
        </li>
      );
      index++;
    });

    if (profile) {
      if (!mapping) {
        setMapping(profile.profile_mapping);
      }
      console.log(mapping);
    }

    if (framework) {
      competencyForm = framework.map((item) =>
        item.domains.map((domain, did) => (
          <ul>
            <li className="domain_list">
              <div className="row callout">
                <div className="column medium-9">
                  <h5 className="domain_title"> {domain.title}</h5>
                </div>
              </div>
              <ul>
                {domain.competencies.map((competency, cid) => (
                  <li className="competency_list">
                    <div className="row">
                      <div className="column medium-9">
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
                            {attribute_types.map((attribute_type) => {
                              return (
                                <li className="attribute_type">
                                  {attribute_type}
                                  <ul>
                                    {competency.attributes
                                      .filter(
                                        (attribute) =>
                                          attribute.type == attribute_type
                                      )
                                      .map((attribute) => (
                                        <li className="attribute_title">
                                          <div className="row">
                                            <div className="column medium-1">
                                              <input
                                                type="checkbox"
                                                id={attribute.id}
                                                onChange={(e) =>
                                                  handleCheckBox(e)
                                                }
                                                defaultChecked={
                                                  mapping.find((o) =>
                                                    o.attributes.find(
                                                      (a) => a == attribute.id
                                                    )
                                                  )
                                                    ? true
                                                    : false
                                                }
                                                disabled={
                                                  mapping.find(
                                                    (o) =>
                                                      o.competency ==
                                                      competency.id
                                                  )
                                                    ? false
                                                    : true
                                                }
                                                data-competency={competency.id}
                                              />
                                            </div>
                                            <div className="column medium-11">
                                              <label
                                                className="attribute_label"
                                                for={attribute.id}
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
                            })}
                          </ul>
                        </Collapsible>
                      </div>
                      <div className="column medium-3">
                        <select
                          onChange={(e) => handleSelect(e)}
                          defaultValue={
                            mapping.find((o) => o.competency == competency.id)
                              ? mapping.find(
                                  (o) => o.competency == competency.id
                                ).expertise
                              : expertise_not_applicable
                          }
                        >
                          {expertise_levels.map((key, value) => (
                            <option
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
        <div>
          <div className="row">
            <h2>
              Competency mapping: {frameworkFullName} {frameworkVersion} -{' '}
              {profile.job_title}{' '}
            </h2>

            <div className="column medium-12">
              <div className="row">
                <div className="column medium-10" />
                <div className="column medium-2">
                  <Link
                    to={`/framework/bioexcel/2.0/profile/view/${profileId}/alias`}
                  >
                    <i class="icon icon-common icon-angle-left" /> Profile
                    overview
                  </Link>
                  <p />
                </div>
              </div>

              <div className="row">
                <div className="column medium-3">
                  <img
                    src={profile.image[0] ? profile.image[0].url : user_icon}
                    width="150px"
                  />
                </div>
                <div className="column medium-9 form_intro">
                  <h3 />
                  <p>
                    The form below is listing competencies from{' '}
                    {frameworkFullName} competency framework. A competency is an
                    observable ability of any professional, integrating multiple
                    components such as knowledge, skills and behaviours. A
                    competency profile lists and defines all the competencies
                    that an individual might need to fulfil a particular role,
                    or that define specific user groups.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="column medium-3">
                  {' '}
                  <h5 style={{ marginTop: '25px' }}>
                    {frameworkFullName} {frameworkVersion} / Competencies
                  </h5>
                </div>
                <div className="column medium-9 ">
                  <ul className="legend-inline" style={{ float: 'right' }}>
                    {expertise_levels_legend}
                  </ul>
                </div>
              </div>
              <hr />

              <div className="competency_section">
                {
                  <form onSubmit={(e) => handleSubmit(e)}>
                    {competencyForm}
                    <div className="submit_fixed">
                      <button className="button" type="submit">
                        Save <i class="icon icon-common icon-save" />
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

export const MapProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/map/:id"
      component={ProfileMap}
    />
  </Switch>
);

export default MapProfile;
