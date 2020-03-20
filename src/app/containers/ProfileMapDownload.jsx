import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
import HttpService from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import user_icon from './user_icon.png';
import Parser from 'html-react-parser';

import jsPDF from 'jspdf';
import moment from 'moment';

const $ = window.$;

export const ProfileMapDownload = props => {
  // const activeRequests = new ActiveRequestsService();
  // const profileService = new ProfileService();

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [expertiseLevels, setExpertiseLevels] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  // const [ksa, setKsa] = useState();
  const [profileAttributes, setProfileAttributes] = useState([]);

  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  var competencyForm = '';
  var expertise_levels = [];
  var expertise_not_applicable = '';
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkDesc = '';
  var frameworkLogo = '';

  var mapping = [];
  let mappingAttributes = [];

  const http = new HttpService();

  useEffect(() => {
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));

    if (storedProfile) {
      // Get Profile from Session
      setProfile(storedProfile);

      const fetchData = async () => {
        try {
          // Get Framework
          const promiseFramework = http
            .get(`${apiUrl}/api/version_manager?_format=json`)
            .then(responseFramework => responseFramework.data);

          // Get Framework version
          const promiseVersion = http
            .get(
              `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
            )
            .then(responseVersion => responseVersion.data);

          const [dataFramework, dataVersion] = await Promise.all([
            promiseFramework,
            promiseVersion
          ]);

          getExpertiseLevels(dataFramework, dataVersion[0].nid);
          setFrameworkInfo(dataFramework);
          setFramework(dataVersion);
          // return false;
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    // Download Profile
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
    downloadProfileFromHtml(storedProfile);
  };

  const handleMapping = event => {
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
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

      if (tempMap.find(o => o.competency_id === competency_id)) {
        // Update stored Competencies only if existing levels of expertise is updated
        if (tempMap.expertise_id != expertise_id) {
          var index = tempMap.findIndex(
            item => item.competency_id === competency_id
          );
          // replace current stored values with incoming ones
          tempMap.splice(index, 1, {
            competency_id: competency_id,
            expertise_id: expertise_id,
            expertise: expertise
          });
        }
        // Update local Storage mapping
        storedProfile['mapping'] = tempMap;
        localStorage.setItem(
          'ProfileDownloadData',
          JSON.stringify(storedProfile)
        );
      } else {
        // Add competency that has been selected
        let tempMap = storedProfile['mapping'];
        tempMap.push({
          competency_id: competency_id,
          expertise_id: expertise_id,
          expertise: expertise
        });
        storedProfile['mapping'] = tempMap;
        localStorage.setItem(
          'ProfileDownloadData',
          JSON.stringify(storedProfile)
        );
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
  const addCompetencyAttributes = competency => {
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
    // let selectedAttributes = new Array();

    let mappingAttributes = storedProfile['mappingAttributes'];
    let attributes = $(
      'input:checkbox[data-competency=' + competency + ']'
    ).each(function() {
      if (
        mappingAttributes.find(attr => attr.attribute_id === $(this).attr('id'))
      ) {
        // Do nothing if attributes are in LocalStorage already
      } else {
        mappingAttributes.push({
          attribute_id: $(this).attr('id'),
          competency_id: competency
        });
      }
    }, mappingAttributes);

    storedProfile['mappingAttributes'] = mappingAttributes;
    localStorage.setItem('ProfileDownloadData', JSON.stringify(storedProfile));
    setProfileAttributes(storedProfile);
  };

  // Remove current attributes if Competency is deselected
  const removeCompetencyAttributes = competency => {
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
    let mappingAttributes = storedProfile['mappingAttributes'];
    let attributes = $(
      'input:checkbox[data-competency=' + competency + ']'
    ).each(function() {
      let index = mappingAttributes.findIndex(
        item => item.attribute_id === $(this).attr('id')
      );
      // Remove current attributes if Competency is deselected
      mappingAttributes.splice(index, 1);
    }, mappingAttributes);

    // localStorage.setItem('mappingAttributes', JSON.stringify(mappingAttributes));
    storedProfile['mappingAttributes'] = mappingAttributes;
    localStorage.setItem('ProfileDownloadData', JSON.stringify(storedProfile));
    setProfileAttributes(storedProfile);
  };

  // Manage single Attributes check/uncheck event
  const handleCheckboxMapping = event => {
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
    let competency_id = event.target.getAttribute('data-competency');
    let attribute_id = event.target.getAttribute('id');

    // let mappingAttributes = JSON.parse(localStorage.getItem('mappingAttributes'));
    let mappingAttributes = storedProfile['mappingAttributes'];
    let attributes = mappingAttributes;

    if (mappingAttributes.find(attr => attr.attribute_id === attribute_id)) {
      // Remove current attribute if deselected
      var index = mappingAttributes.findIndex(
        item => item.attribute_id === attribute_id
      );
      mappingAttributes.splice(index, 1);
      // localStorage.setItem('mappingAttributes', JSON.stringify(mappingAttributes));
      storedProfile['mappingAttributes'] = mappingAttributes;
      localStorage.setItem(
        'ProfileDownloadData',
        JSON.stringify(storedProfile)
      );
    } else {
      // Add attribute to LocalStorage
      attributes.push({
        attribute_id: attribute_id,
        competency_id: competency_id
      });
      // localStorage.setItem('mappingAttributes', JSON.stringify(attributes));
      storedProfile['mappingAttributes'] = attributes;
      $('input:checkbox[id=' + attribute_id + ']').prop('checked', true);
      localStorage.setItem(
        'ProfileDownloadData',
        JSON.stringify(storedProfile)
      );
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

  // Get Expertise Level from API.
  const getExpertiseLevels = (frameworkInfo, fId) => {
    let fw = frameworkInfo.filter(item => {
      return item.nid === fId;
    });

    let levels = fw[0].expertise_levels;

    // Set Expertise Level
    setExpertiseLevels(levels);
  };

  const downloadProfileFromHtml = options => {
    let doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont('helvetica');
    const margin = 0.5;

    let currentDate = moment().format('MMMM D, Y');
    let currentTime = moment().format('hh:mm:ss');

    let pdfWidth = doc.internal.pageSize.getWidth();
    let pdfHeight = doc.internal.pageSize.getHeight();

    const startHeight = 30;
    const marginleft = 20;
    const pdfProfileImgWidth = 180;
    const pageLogoWidth = 100;

    let marginright = doc.internal.pageSize.getWidth() - 20;
    let col = pdfWidth * 0.07383;
    let gutter = pdfWidth * 0.01036727272;
    let fourthCol = col * 4 + gutter * 3;
    let fifthCol = col * 5 + gutter * 4;

    const profileBody = pdfWidth - fifthCol - 20;

    let selectedFileWidth = options.selectedFile
      ? options.selectedFileData[0].width
      : 180;
    let selectedFileHeight = options.selectedFile
      ? options.selectedFileData[0].height
      : 150;
    let ratio = selectedFileWidth / selectedFileHeight;
    let pdfProfileImgHeight = pdfProfileImgWidth / ratio;

    let currentYAxis = startHeight;

    var specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    let margins = {
      top: startHeight,
      bottom: 60,
      left: marginleft,
      right: marginright,
      width: 490
    };

    var source = document.getElementById('profile');

    // source = doc.splitTextToSize(
    //   source,
    //   profileBody
    // );

    let profileTitle = options.jobTitle.split(' ').join('_');
    doc.fromHTML(
      source,
      marginleft,
      currentYAxis,
      {
        // y coord
        width: margins.width, // max width of content on PDF
        elementHandlers: specialElementHandlers
      },
      function(dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        doc.save(profileTitle.toLowerCase() + '.pdf');
      }
      // margins
    );

    // doc.output("/framework/bioexcel/2.0/profile/map/download/myprofile");
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
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            level => (
              (expertise_levels[level.id] = level.title),
              level.title == 'Not applicable'
                ? (expertise_not_applicable = level.id)
                : ''
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
      });
    }

    if (profile) {
      mapping = profile.mapping;

      let storedProfile = JSON.parse(
        localStorage.getItem('ProfileDownloadData')
      );
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
                                        attribute =>
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
                                                onChange={e =>
                                                  handleCheckboxMapping(e)
                                                }
                                                type="checkbox"
                                                id={attribute.id}
                                                data-competency={competency.id}
                                                checked={
                                                  mappingAttributes.find(
                                                    attr =>
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
                                                    attr =>
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
                          onChange={e => handleMapping(e)}
                          defaultValue={
                            mapping.find(o => o.competency_id == competency.id)
                              ? mapping.find(
                                  o => o.competency_id == competency.id
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

  return (
    <div>
      {generateForm()}
      {profile ? (
        <div>
          <div className="row">
            <h2>Add competencies to your profile </h2>

            <div id="profile" className="column medium-12">
              <div className="row">
                <div className="column medium-9">
                  <h3>
                    {profile.title.charAt(0).toUpperCase() +
                      profile.title.slice(1)}{' '}
                    - {profile.jobTitle}
                  </h3>
                </div>
                <div className="column medium-3">
                  <img src={frameworkLogo} />
                  <br />
                </div>
              </div>

              <div className="row">
                <div className="column medium-3 text-center">
                  {profile.selectedFileData[0] ? (
                    <img
                      src={
                        profile.selectedFileData[0].src
                          ? profile.selectedFileData[0].src
                          : user_icon
                      }
                      width="250px"
                    />
                  ) : (
                    ''
                  )}
                  <div className="text-center">
                    <br />
                    {profile.gender}, {profile.age} years
                  </div>
                </div>
                <div className="column medium-6">
                  <div
                    className="form_intro"
                    dangerouslySetInnerHTML={setFieldContent(
                      'Qualifications and background',
                      profile.qualification
                    )}
                  />
                  {/* <div className="form_intro"
                    dangerouslySetInnerHTML={{ __html: profile.qualification }}
                  /> */}

                  <div
                    className="form_intro"
                    dangerouslySetInnerHTML={setFieldContent(
                      'Activities and current role',
                      profile.currentRole
                    )}
                  />

                  <div
                    className="form_intro"
                    dangerouslySetInnerHTML={setFieldContent(
                      'Additional information',
                      profile.additionalInfo
                    )}
                  />
                </div>
                <div className="column medium-3" />
              </div>

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
                    {
                      <form onSubmit={e => handleSubmit(e)}>
                        {competencyForm}
                        <div className="submit_fixed">
                          <button className="button" type="submit">
                            Download{' '}
                            <i className="icon icon-common icon-download" />
                          </button>
                        </div>
                      </form>
                    }
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="column medium-3">
                  {/* <div>{profile.qualification}</div> */}

                  {/* <div>{profile.currentRole}</div> */}
                  {/* <h5>{profile.title}</h5> */}
                  {/* <Link
                    to={`/framework/bioexcel/2.0/profile/view/${profileId}/alias`}
                  >
                    {' '}
                    <i className="icon icon-common icon-angle-left" /> Profile
                    overview{' '}
                  </Link> */}
                </div>
                <div className="column medium-6 form_intro" />
                <div className="column medium-3">
                  {/* <img src={frameworkLogo} />
                  <br /> */}
                </div>
              </div>

              {/* <div className="competency_section">
                {
                  <form onSubmit={e => handleSubmit(e)}>
                    {competencyForm}
                    <div className="submit_fixed">
                      <button className="button" type="submit">
                        Download{' '}
                        <i className="icon icon-common icon-download" />
                      </button>
                    </div>
                  </form>
                }
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export const MapProfileDownload = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/map/download"
      component={ProfileMapDownload}
    />
  </Switch>
);

export default MapProfileDownload;
