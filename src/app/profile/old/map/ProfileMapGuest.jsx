import React, { useState, useEffect } from 'react';

import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import { ProfileHeader } from '../../map/ProfileHeader';
import ActiveRequestsService from '../../../services/active-requests/active-requests';
import CompetencyService from '../../../services/competency/competency';
import ProfileService from '../../../services/profile/profile';

const $ = window.$;

const activeRequests = new ActiveRequestsService();
const competencyService = new CompetencyService();
const profileService = new ProfileService();

export const ProfileMap = ({ match }) => {
  const hasProfile = profileService.hasGuestProfile();

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [expertiseLevels, setExpertiseLevels] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  const [, setProfileAttributes] = useState([]);

  const { framework: frameworkName, version: frameworkVersion } = match.params;

  let competencyForm = '';
  let expertise_levels = [];
  let expertise_not_applicable = '';
  let attribute_types = [];
  let frameworkFullName = '';
  let frameworkDesc = '';
  let frameworkLogo = '';

  let mapping = [];
  let mappingAttributes = [];

  useEffect(() => {
    if (!hasProfile) {
      return;
    }
    // Get Profile from Session
    setProfile(profileService.getGuestProfile());

    const fetchData = async () => {
      try {
        activeRequests.startRequest();
        const [dataFramework, dataVersion] = await Promise.all([
          competencyService.getAllVersionedFrameworks(),
          competencyService.getVersionedFramework(
            frameworkName,
            frameworkVersion
          ),
        ]);

        setExpertiseLevels(
          getExpertiseLevels(dataFramework, dataVersion[0].nid)
        );
        setFrameworkInfo(dataFramework);
        setFramework(dataVersion);
      } finally {
        activeRequests.finishRequest();
      }
    };

    fetchData();
  }, [frameworkName, frameworkVersion, hasProfile]);

  const handleMapping = (event) => {
    let storedProfile = profileService.getGuestProfile();
    let competency_id = event.target[event.target.selectedIndex].getAttribute(
      'data-competency'
    );
    let expertise_id = event.target[event.target.selectedIndex].getAttribute(
      'data-expertise'
    );
    let expertise = event.target[event.target.selectedIndex].text;

    if (expertise_id == expertise_not_applicable) {
      $('input:checkbox[data-competency=' + competency_id + ']').prop(
        'checked',
        false
      );
      $('input:checkbox[data-competency=' + competency_id + ']').prop(
        'disabled',
        true
      );

      removeCompetencyAttributes(competency_id);
    } else {
      // Create temp mapping
      let tempMap = storedProfile['mapping'];

      if (tempMap.find((o) => o.competency_id === competency_id)) {
        // Update stored Competencies only if existing levels of expertise is updated
        if (tempMap.expertise_id != expertise_id) {
          let index = tempMap.findIndex(
            (item) => item.competency_id === competency_id
          );
          // replace current stored values with incoming ones
          tempMap.splice(index, 1, {
            competency_id: competency_id,
            expertise_id: expertise_id,
            expertise: expertise,
          });
        }
        // Update local Storage mapping
        storedProfile['mapping'] = tempMap;
        profileService.editGuestProfile(storedProfile);
      } else {
        // Add competency that has been selected
        let tempMap = storedProfile['mapping'];
        tempMap.push({
          competency_id: competency_id,
          expertise_id: expertise_id,
          expertise: expertise,
        });
        storedProfile['mapping'] = tempMap;
        profileService.editGuestProfile(storedProfile);
      }

      $('input:checkbox[data-competency=' + competency_id + ']').prop(
        'checked',
        true
      );
      $('input:checkbox[data-competency=' + competency_id + ']').prop(
        'disabled',
        false
      );

      // Add Competency's selected attributes to LocalStorage
      addCompetencyAttributes(competency_id);
    }
  };

  // Add all attributes to LocalStorage if Competency is selected
  const addCompetencyAttributes = (competency) => {
    let storedProfile = profileService.getGuestProfile();
    // let selectedAttributes = new Array();

    let mappingAttributes = storedProfile['mappingAttributes'];
    $('input:checkbox[data-competency=' + competency + ']').each(function () {
      if (
        mappingAttributes.find(
          (attr) => attr.attribute_id === $(this).attr('id')
        )
      ) {
        // Do nothing if attributes are in LocalStorage already
      } else {
        mappingAttributes.push({
          attribute_id: $(this).attr('id'),
          competency_id: competency,
        });
      }
    }, mappingAttributes);

    storedProfile['mappingAttributes'] = mappingAttributes;
    profileService.editGuestProfile(storedProfile);
    setProfileAttributes(storedProfile);
  };

  // Remove current attributes if Competency is deselected
  const removeCompetencyAttributes = (competency) => {
    let storedProfile = profileService.getGuestProfile();
    let mappingAttributes = storedProfile['mappingAttributes'];
    $('input:checkbox[data-competency=' + competency + ']').each(function () {
      let index = mappingAttributes.findIndex(
        (item) => item.attribute_id === $(this).attr('id')
      );
      // Remove current attributes if Competency is deselected
      mappingAttributes.splice(index, 1);
    }, mappingAttributes);

    // window.localStorage.setItem('mappingAttributes', JSON.stringify(mappingAttributes));
    storedProfile['mappingAttributes'] = mappingAttributes;
    profileService.editGuestProfile(storedProfile);
    setProfileAttributes(storedProfile);
  };

  // Manage single Attributes check/uncheck event
  const handleCheckboxMapping = (event) => {
    let storedProfile = profileService.getGuestProfile();
    let competency_id = event.target.getAttribute('data-competency');
    let attribute_id = event.target.getAttribute('id');

    // let mappingAttributes = JSON.parse(localStorage.getItem('mappingAttributes'));
    let mappingAttributes = storedProfile['mappingAttributes'];
    let attributes = mappingAttributes;

    if (mappingAttributes.find((attr) => attr.attribute_id === attribute_id)) {
      // Remove current attribute if deselected
      let index = mappingAttributes.findIndex(
        (item) => item.attribute_id === attribute_id
      );
      mappingAttributes.splice(index, 1);
      // window.localStorage.setItem('mappingAttributes', JSON.stringify(mappingAttributes));
      storedProfile['mappingAttributes'] = mappingAttributes;
      profileService.editGuestProfile(storedProfile);
    } else {
      // Add attribute to LocalStorage
      attributes.push({
        attribute_id: attribute_id,
        competency_id: competency_id,
      });
      // window.localStorage.setItem('mappingAttributes', JSON.stringify(attributes));
      storedProfile['mappingAttributes'] = attributes;
      $('input:checkbox[id=' + attribute_id + ']').prop('checked', true);
      profileService.editGuestProfile(storedProfile);
    }
    setProfileAttributes(storedProfile);
  };

  // Set Expertise Level.
  // const expertiseLevelsSelect= [
  //   {id: 1, title: 'Not applicable', data_expertise: '6816'},
  //   {id: 2, title: 'Awareness', data_expertise: '6817'},
  //   {id: 3, title: 'Working knowledge', data_expertise: '6818'},
  //   {id: 4, title: 'Specialist knowledge', data_expertise: '6819'}
  // ];
  const getExpertiseLevels = (frameworkInfo, fId) => {
    return frameworkInfo.find((item) => item.nid === fId).expertise_levels;
  };

  // Set fielc HTML content + Heading if not empty
  const setFieldContent = (heading, field) => {
    let fieldContent = field ? '<h3>' + heading + '</h3>' + field : '';
    return { __html: fieldContent };
  };

  const generateForm = () => {
    // console.log('frameworkInfo')
    // console.log(frameworkInfo)
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

    if (profile) {
      mapping = profile.mapping;

      let storedProfile = profileService.getGuestProfile();
      mappingAttributes = storedProfile['mappingAttributes'];
    }

    if (framework) {
      competencyForm = framework.map((item, index) =>
        item.domains.map((domain, did) => (
          <ul>
            <li key={index} className="domain_list">
              <div className="row callout">
                <div className="column medium-9">
                  <h4 className="domain_title"> {domain.title}</h4>
                </div>
                <div className="column medium-3">
                  <h4>Levels of expertise</h4>
                </div>
              </div>
              <ul>
                {domain.competencies.map((competency, cid) => (
                  <li key={cid} className="competency_list">
                    <div className="row">
                      <div className="column medium-9">
                        <Collapsible
                          trigger={
                            <div className="open-close-title">
                              <h5>
                                <span className="icon icon-common icon-angle-down icon-custom">
                                  <p className="show-for-sr">show more</p>
                                </span>
                                {competency.title}
                              </h5>
                            </div>
                          }
                          triggerWhenOpen={
                            <div className="open-close-title">
                              <h5>
                                <span className="icon icon-common icon-angle-up icon-custom">
                                  <p className="show-for-sr">show less</p>
                                </span>
                                {competency.title}
                              </h5>
                            </div>
                          }
                        >
                          <ul>
                            {attribute_types.map((attribute_type, index) => {
                              return (
                                <li key={index} className="attribute_type">
                                  {attribute_type}
                                  <ul>
                                    {competency.attributes
                                      .filter(
                                        (attribute) =>
                                          attribute.type == attribute_type
                                      )
                                      .map((attribute, jIndex) => (
                                        <li
                                          key={jIndex}
                                          className="attribute_title"
                                        >
                                          <div className="row">
                                            <div className="column medium-1">
                                              <input
                                                onChange={(e) =>
                                                  handleCheckboxMapping(e)
                                                }
                                                type="checkbox"
                                                id={attribute.id}
                                                data-competency={competency.id}
                                                checked={
                                                  mappingAttributes.find(
                                                    (attr) =>
                                                      attr.attribute_id ==
                                                      attribute.id
                                                  )
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                            <div className="column medium-11">
                                              <label
                                                className={
                                                  mappingAttributes.find(
                                                    (attr) =>
                                                      attr.attribute_id ==
                                                      attribute.id
                                                  )
                                                    ? 'attribute_label checked'
                                                    : 'attribute_label'
                                                }
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
                            })}
                          </ul>
                        </Collapsible>
                      </div>

                      <div className="column medium-3">
                        <select
                          onChange={(e) => handleMapping(e)}
                          defaultValue={
                            mapping.find(
                              (o) => o.competency_id == competency.id
                            )
                              ? mapping.find(
                                  (o) => o.competency_id == competency.id
                                ).expertise_id
                              : expertise_not_applicable
                          }
                        >
                          {expertiseLevels.map((level, key) => (
                            <option
                              key={key}
                              value={level.id}
                              data-expertise={level.id}
                              data-competency={competency.id}
                            >
                              {level.title}
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

  if (!hasProfile) {
    return <Redirect to="../edit/guest" />;
  }

  return (
    <div>
      {generateForm()}
      {profile && (
        <div>
          <div className="row">
            <h2 className="hide-for-print">
              Add competencies to your profile{' '}
            </h2>

            <div id="profile" className="column medium-12">
              <div className="row">
                <div className="column medium-9">
                  <h3>
                    {profile.title.charAt(0).toUpperCase() +
                      profile.title.slice(1)}{' '}
                    - {profile.job_title}
                  </h3>
                </div>
                {/* <div className="column medium-3">
                  <img src={frameworkLogo} alt="Framework logo" />
                  <br />
                </div> */}
              </div>

              <ProfileHeader {...profile} />

              <div className="row">
                <div className="column medium-9">
                  <br />
                  <h3>Your competencies</h3>
                  <p>
                    The form below is listing competencies from{' '}
                    {frameworkFullName} competency framework. A competency is an
                    observable ability of any professional, integrating multiple
                    components such as knowledge, skills and behaviours. A
                    competency profile lists and defines all the competencies
                    that an individual might need to fulfil a particular role,
                    or that define specific user groups.
                  </p>
                  <p>
                    You may assign a level expertise against each competency.
                    The levels of expertise are:
                  </p>
                  <ul>
                    {expertise_levels.map((level, index) => (
                      <li key={index}>{level}</li>
                    ))}
                  </ul>
                </div>
                <div className="column medium-3" />
              </div>

              <div className="row">
                <div className="column medium-12">
                  <div className="competency_section">
                    {competencyForm}
                    <div className="submit_fixed">
                      <Link to="../view/guest" className="button">
                        Preview{' '}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMap;
