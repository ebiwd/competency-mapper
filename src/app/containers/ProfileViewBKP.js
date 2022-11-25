import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
//import CKEditor from 'react-ckeditor-component';
import Parser from 'html-react-parser';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';

import jsPDF from 'jspdf';
import moment from 'moment';
import auth from '../services/util/auth';

const $ = window.$;

export const ProfileView = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];
  const alias = props.location.pathname.split('/')[7];

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();

  var competencyView = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  var frameworkLogo = '';
  var frameworkDesc = '';
  var mapping = [];

  var user_roles = auth.currently_logged_in_user.roles;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/profiles?_format=json&id=${profileId}&timestamp=${Date.now()}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
        });

      await fetch(`${apiUrl}/api/version_manager?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });
    };
    fetchData();
  }, [profileId]);

  const checkAlias = () => {
    if (profile) {
      let url_alias = profile.url_alias;

      if (profile.url_alias != alias) {
        props.history.push(
          `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}${url_alias}`
        );
      }
    }
  };

  const getExpertise = competency => {
    let obj = mapping.find(o => o.competency == competency);
    if (obj) {
      if (frameworkInfo) {
        let expertise = frameworkInfo[0].expertise_levels.find(
          level => level.id == obj.expertise
        );
        return expertise.title;
      }
    } else {
      return '';
    }
  };

  const getAttributeStatus = aid => {
    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a == aid)
      );
      return attribute_check_status;
    }
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            level => (expertise_levels[level.id] = level.title)
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

    let index = 0;
    expertise_levels.map((level, key) => {
      expertise_levels_legend.push(
        "<li class='legend'>  <div class='legend_number'> " +
          index +
          '</div>' +
          level +
          '</li>'
      );
      index++;
    });

    if (profile) {
      mapping = profile.profile_mapping;
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map((domain, did) => (
          <ul>
            <li className="domain_list">
              <div className="row callout">
                <div className="column medium-9">
                  <h4 className="domain_title"> {domain.title}</h4>
                </div>
                <div className="column medium-3">
                  <h4>
                    Levels of expertise{' '}
                    <span
                      data-tip={
                        "<ul class='legend_container'>" +
                        expertise_levels_legend +
                        '</ul> '
                      }
                      data-html={true}
                      data-type="light"
                    >
                      <i className="icon icon-common icon-info" />
                    </span>
                  </h4>
                  <ReactTooltip />
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
                              <h5>
                                {competency.title}
                                <span className="icon icon-common icon-angle-right icon-custom">
                                  <p className="show-for-sr">show more</p>
                                </span>
                              </h5>
                            </div>
                          }
                          triggerWhenOpen={
                            <div className="open-close-title">
                              <h5>
                                {competency.title}
                                <span className="icon icon-common icon-angle-down icon-custom">
                                  <p className="show-for-sr">show less</p>
                                </span>
                              </h5>
                            </div>
                          }
                        >
                          <ul>
                            {attribute_types.map(attribute_type => {
                              return (
                                <li className="attribute_type">
                                  {attribute_type}
                                  <ul>
                                    {competency.attributes
                                      .filter(
                                        attribute =>
                                          attribute.type == attribute_type
                                      )
                                      .map(attribute => (
                                        <li className="attribute_title">
                                          <div className="row">
                                            <div className="column medium-12">
                                              <span
                                                className={
                                                  getAttributeStatus(
                                                    attribute.id
                                                  )
                                                    ? 'attribute_selected'
                                                    : 'attribute_not_selected'
                                                }
                                              >
                                                {getAttributeStatus(
                                                  attribute.id
                                                ) ? (
                                                  <i className="icon icon-common icon-check" />
                                                ) : (
                                                  ''
                                                )}{' '}
                                                {attribute.title}
                                              </span>
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
                        <h5>
                          {getExpertise(competency.id)
                            ? getExpertise(competency.id)
                            : 'Not applicable'}
                        </h5>
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

  const handleDownload = e => {
    e.preventDefault();

    // Download Profile
    let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
    downloadProfileFromHtml(storedProfile);
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
    var sourceFull = document.getElementById('profile');
    var source = sourceFull.childNodes[3].childNodes[0];

    //console.log(source[0].attributes)
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
  };

  return (
    <div>
      {generateProfileView()}
      {profile ? (
        <div id="profile">
          {
            //checkAlias()
          }

          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
          </h2>

          <div style={{ float: 'right' }}>
            {user_roles.includes('framework_manager') ? (
              <ul>
                <li className="profile_navigation">
                  <Link
                    to={`/framework/bioexcel/2.0/profile/edit/${profileId}`}
                  >
                    Edit overview
                    <i className="icon icon-common icon-pencil-alt" />
                  </Link>
                </li>
                <li className="profile_navigation">
                  <Link to={`/framework/bioexcel/2.0/profile/map/${profileId}`}>
                    Map competencies <i className="icon icon-common icon-cog" />{' '}
                  </Link>
                </li>
              </ul>
            ) : (
              <Link to={`/framework/bioexcel/2.0/profile/create`}>
                Create your profile <i className="icon icon-common icon-plus" />
              </Link>
            )}
          </div>

          <div className="row">
            <div className="column large-4">
              <center>
                <img
                  style={{ display: 'block', maxWidth: '200px' }}
                  src={profile.image[0] ? profile.image[0].url : ''}
                />
              </center>
              <p />
              <p style={{ textAlign: 'center' }}>
                {profile.gender ? profile.gender : ''}{' '}
                {profile.age ? '| ' + profile.age + ' years' : ''}
              </p>
            </div>
            <div className="column large-8">
              <h3>Qualification and background</h3>
              <p>
                {profile.qualification_background
                  ? Parser(profile.qualification_background)
                  : ''}
              </p>

              <h3>Acitivities of current role</h3>
              <p>{profile.current_role ? Parser(profile.current_role) : ''}</p>

              <p>
                {profile.additional_information
                  ? Parser(profile.additional_information)
                  : ''}
              </p>
            </div>
            <p />
          </div>
          {competencyView}
        </div>
      ) : (
        'Loaing profile'
      )}

      <form onSubmit={e => handleDownload(e)}>
        <div className="submit_fixed">
          <button className="button" type="submit">
            Download <i className="icon icon-common icon-download" />
          </button>
        </div>
      </form>
    </div>
  );
};

export const ViewProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/view/:id/:alias"
      component={ProfileView}
    />
  </Switch>
);

export default ViewProfile;
