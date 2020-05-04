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
  var user_roles = localStorage.getItem('roles')
    ? localStorage.getItem('roles')
    : '';

  let profile2Expertise = '';
  let width2 = '';
  let floatRight = '';

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
    if (mapping) {
      let obj = mapping.find(o => o.competency == competency);
      if (obj) {
        if (frameworkInfo) {
          let expertise = frameworkInfo[0].expertise_levels.find(
            level => level.id == obj.expertise
          );
          return expertise;
        }
      } else {
        return '';
      }
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

  const getBarWidth = data => {
    width2 = data ? 100 / (3 / data.rating_level) : 0;
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      console.log(frameworkInfo);
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          frameworkLogo = info.logo[0].url;
          frameworkDesc = info.description;
          info.expertise_levels.map(
            level => (expertise_levels[level.rating_level] = level.title)
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
        <li style={{ textAlign: 'center' }}>
          <span className="badge secondary"> {key} </span> <span> {level}</span>
        </li>
      );
      index++;
    });

    if (profile) {
      mapping = profile.profile_mapping;
      console.log(mapping);
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map(domain => (
          <div>
            <div className="row callout">
              <div className="column medium-12 ">
                <h5>{domain.title}</h5>{' '}
              </div>
            </div>
            {domain.competencies.map(competency => (
              <div>
                <div className="row">
                  <div className="column medium-8">
                    <span className="competency_title">
                      {' '}
                      {competency.title.length > 150
                        ? competency.title
                            .split(' ')
                            .splice(0, 18)
                            .join(' ') + ' ..'
                        : competency.title}
                    </span>
                  </div>
                  <div className="column medium-4">
                    <div className="fillerbg">
                      <div
                        className="fillerRight"
                        style={{
                          width: getBarWidth(getExpertise(competency.id)) + '%',
                          display: 'flow-root'
                        }}
                      >
                        <span
                          style={{
                            float:
                              getBarWidth(getExpertise(competency.id)) == 0
                                ? 'none'
                                : 'right'
                          }}
                          className="rating_level_number"
                        >
                          {getExpertise(competency.id)
                            ? getExpertise(competency.id).rating_level
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_collapsible">
                  <Collapsible
                    trigger={
                      <div className="open-close-title">
                        <i className="icon icon-common icon-angle-right icon-custom" />
                      </div>
                    }
                    triggerWhenOpen={
                      <div className="open-close-title">
                        <i className="icon icon-common icon-angle-down icon-custom" />
                      </div>
                    }
                  >
                    {attribute_types.map(attribute_type => {
                      return (
                        <div
                          className="accordion-item is-active"
                          data-accordion-item
                        >
                          <div className="row attribute_align_type">
                            <div className="column medium-8">
                              <strong> {attribute_type} </strong>
                            </div>
                            <div className="column medium-4" />
                          </div>
                          {competency.attributes
                            .filter(
                              attribute => attribute.type == attribute_type
                            )
                            .map(attribute => {
                              return (
                                <div className="row attribute_align">
                                  <div className="column medium-8">
                                    {attribute.title}
                                  </div>
                                  <div className="column medium-4">
                                    {getAttributeStatus(
                                      attribute.id,
                                      'profile1'
                                    ) ? (
                                      <i className="icon icon-common icon-check" />
                                    ) : (
                                      '-'
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>
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
    var source = sourceFull;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {generateProfileView()}

      {profile ? (
        <div id="profile">
          <h2 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
          </h2>

          <div style={{ float: 'right' }}>
            {user_roles.search('framework_manager') != -1 ? (
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
                    {console.log(localStorage.getItem('roles'))}
                  </Link>
                </li>
              </ul>
            ) : (
              <Link to={`/framework/bioexcel/2.0/profile/create`}>
                Create your profile <i className="icon icon-common icon-plus" />
              </Link>
            )}
          </div>

          <div className={profile.publishing_status + ' row'}>
            <div className="column large-3">
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
            <div className="column large-9">
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
          <p>&nbsp;</p>

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
          {competencyView}
        </div>
      ) : (
        'Loaing profile'
      )}

      <form onSubmit={e => handlePrint(e)}>
        <div className="submit_fixed">
          <button className="button" type="submit">
            Print <i className="icon icon-common icon-print" />
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
