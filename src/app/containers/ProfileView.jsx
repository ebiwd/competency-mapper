import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';
import { apiUrl } from '../services/http/http';
import { Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ReactTooltip from 'react-tooltip';

export const ProfileView = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];
  //const alias = props.location.pathname.split('/')[7];

  const [profile, setProfile] = useState();
  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  const [userFrameworks, setUserFrameworks] = useState([]);

  var competencyView = '';
  //var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  //var frameworkLogo = '';
  //var frameworkDesc = '';
  var mapping = [];
  var user_roles = localStorage.getItem('roles')
    ? localStorage.getItem('roles')
    : '';
  var userName = localStorage.getItem('user')
    ? localStorage.getItem('user')
    : '';

  //let profile2Expertise = '';
  let width2 = '';
  //let floatRight = '';

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}/profiles?_format=json&id=${profileId}&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
        });

      await fetch(
        `${apiUrl}/api/version_manager?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworkInfo(findresponse);
        });

      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&source=competencyhub`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });

      if (userName) {
        await fetch(`${apiUrl}/api/authorisation/${userName}?_format=json`, {
          method: 'GET',
          credentials: 'include'
        })
          .then(Response => Response.json())
          .then(findresponse => {
            setUserFrameworks(findresponse);
          });
      }
    };
    fetchData();
  }, [profileId, frameworkVersion, frameworkName, userName]);

  // const checkAlias = () => {
  //   if (profile) {
  //     let url_alias = profile.url_alias;

  //     if (profile.url_alias != alias) {
  //       props.history.push(
  //         `/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}${url_alias}`
  //       );
  //     }
  //   }
  // };

  const getExpertise = competency => {
    if (mapping) {
      let obj = mapping.find(o => o.competency === competency);
      if (obj) {
        if (frameworkInfo) {
          let expertise = frameworkInfo
            .find(info => info.title.toLowerCase() === frameworkName)
            .expertise_levels.find(level => level.id === obj.expertise);
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
        o.attributes.find(a => a === aid)
      );
      return attribute_check_status;
    }
  };

  const getBarWidth = data => {
    let totalLevels = frameworkInfo.find(
      info => info.title.toLowerCase() === frameworkName
    ).expertise_levels.length;
    width2 = data ? 100 / ((totalLevels - 1) / data.rating_level) : 0;
    return width2;
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map((info, infoIndex) => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          //frameworkLogo = info.logo[0].url;
          //frameworkDesc = info.description;
          info.expertise_levels.map((level, levelIndex) =>
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
                <ReactTooltip
                  className="tooltip-custom"
                  style={{ color: 'fff' }}
                />
              </li>
            )
          );
        }
        return null;
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

    if (profile) {
      mapping = profile.profile_mapping;
    }

    if (framework) {
      competencyView = framework.map((item, itemIndex) =>
        item.domains.map((domain, domainIndex) => (
          <React.Fragment key={itemIndex + domainIndex}>
            <div key={domainIndex}>
              <div>
                <h4>{domain.title}</h4>{' '}
              </div>
            </div>
            <div>
              <div>
                {domain.competencies.map((competency, compIndex) => (
                  <React.Fragment key={compIndex}>
                    <div className="vf-grid vf-grid__col-4">
                      <div className="vf-grid__col--span-3">
                        <span className="vf-text vf-text-heading--5 competency_title">
                          {competency.title.length > 150
                            ? competency.title
                                .split(' ')
                                .splice(0, 18)
                                .join(' ') + ' ..'
                            : competency.title}
                        </span>
                      </div>
                      <div className="vf-grid__col--span-1">
                        <div className="fillerbg">
                          <div
                            className="fillerRight"
                            style={{
                              width:
                                getBarWidth(getExpertise(competency.id)) + '%',
                              display: 'flow-root'
                            }}
                          >
                            <span
                              style={{
                                float:
                                  getBarWidth(getExpertise(competency.id)) === 0
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
                        {attribute_types.map((attribute_type, typeIndex) => {
                          return (
                            <div
                              key={typeIndex}
                              className="accordion-item is-active"
                              data-accordion-item
                            >
                              <div className="embl-grid">
                                <div />
                                <ul className="vf-list">
                                  <div>
                                    <strong> {attribute_type} </strong>
                                  </div>
                                  {competency.attributes
                                    .filter(
                                      attribute =>
                                        attribute.type === attribute_type
                                    )
                                    .map((attribute, attrIndex) => {
                                      return (
                                        <li
                                          key={attrIndex}
                                          className="vf-list__item"
                                        >
                                          <span style={{ marginRight: '20px' }}>
                                            {getAttributeStatus(
                                              attribute.id,
                                              'profile1'
                                            ) ? (
                                              <i className="icon icon-common icon-check" />
                                            ) : (
                                              '-'
                                            )}
                                          </span>
                                          <span>{attribute.title}</span>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                      </Collapsible>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))
      );
    }
  };

  // const handleDownload = e => {
  //   e.preventDefault();

  //   // Download Profile
  //   let storedProfile = JSON.parse(localStorage.getItem('ProfileDownloadData'));
  //   downloadProfileFromHtml(storedProfile);
  // };
  // const downloadProfileFromHtml = options => {
  //   let doc = new jsPDF('p', 'pt', 'a4');
  //   doc.setFont('helvetica');
  //   const margin = 0.5;

  //   let currentDate = moment().format('MMMM D, Y');
  //   let currentTime = moment().format('hh:mm:ss');

  //   let pdfWidth = doc.internal.pageSize.getWidth();
  //   let pdfHeight = doc.internal.pageSize.getHeight();

  //   const startHeight = 30;
  //   const marginleft = 20;
  //   const pdfProfileImgWidth = 180;
  //   const pageLogoWidth = 100;

  //   let marginright = doc.internal.pageSize.getWidth() - 20;
  //   let col = pdfWidth * 0.07383;
  //   let gutter = pdfWidth * 0.01036727272;
  //   let fourthCol = col * 4 + gutter * 3;
  //   let fifthCol = col * 5 + gutter * 4;

  //   const profileBody = pdfWidth - fifthCol - 20;

  //   let selectedFileWidth = options.selectedFile
  //     ? options.selectedFileData[0].width
  //     : 180;
  //   let selectedFileHeight = options.selectedFile
  //     ? options.selectedFileData[0].height
  //     : 150;
  //   let ratio = selectedFileWidth / selectedFileHeight;
  //   let pdfProfileImgHeight = pdfProfileImgWidth / ratio;

  //   let currentYAxis = startHeight;

  //   var specialElementHandlers = {
  //     '#editor': function(element, renderer) {
  //       return true;
  //     }
  //   };

  //   let margins = {
  //     top: startHeight,
  //     bottom: 60,
  //     left: marginleft,
  //     right: marginright,
  //     width: 490
  //   };
  //   var sourceFull = document.getElementById('profile');
  //   var source = sourceFull;

  //   let profileTitle = options.jobTitle.split(' ').join('_');
  //   doc.fromHTML(
  //     source,
  //     marginleft,
  //     currentYAxis,
  //     {
  //       // y coord
  //       width: margins.width, // max width of content on PDF
  //       elementHandlers: specialElementHandlers
  //     },
  //     function(dispose) {
  //       // dispose: object with X, Y of the last line add to the PDF
  //       //          this allow the insertion of new lines after html
  //       doc.save(profileTitle.toLowerCase() + '.pdf');
  //     }
  //     // margins
  //   );
  // };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div key={'unique'}>
      {generateProfileView()}
      {profile ? (
        <div key={profileId} id="profile">
          <div style={{ float: 'right' }}>
            {user_roles.search('framework_manager') !== -1 &&
            userFrameworks.length > 0 &&
            userFrameworks.includes(frameworkFullName) ? (
              <ul>
                <li className="profile_navigation">
                  <Link
                    className="vf-link"
                    to={`/framework/${frameworkName}/${frameworkVersion}/profile/edit/${profileId}`}
                  >
                    Edit profile{' '}
                    <i className="icon icon-common icon-pencil-alt" />
                  </Link>
                </li>
              </ul>
            ) : (
              <Link
                className="vf-button vf-button--primary vf-button--sm"
                to={`/framework/${frameworkName}/${frameworkVersion}/profile/create/guest`}
              >
                Create your profile <i className="icon icon-common icon-plus" />
              </Link>
            )}
          </div>
          <h1 style={{ marginTop: '1em', marginBottom: '1em' }}>
            {profile.title} - {profile.job_title}
          </h1>

          <div className={profile.publishing_status + ' embl-grid'}>
            <div>
              <center>
                <img
                  alt=""
                  style={{ display: 'block', maxWidth: '200px' }}
                  src={profile.image[0] ? profile.image[0].url : ''}
                />
              </center>
              <p />
              <p style={{ textAlign: 'center' }}>
                {profile.gender !== 'None' ? (
                  <div>
                    <p>
                      {profile.gender && profile.gender === 'Prefernottosay' ? (
                        <p> Gender: Prefer not to say </p>
                      ) : (
                        ''
                      )}
                    </p>
                    <p>
                      {profile.gender && profile.gender !== 'Prefernottosay' ? (
                        <p> Gender: {profile.gender} </p>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                ) : (
                  ''
                )}
                {profile.age ? profile.age + ' years' : ''}
              </p>
            </div>
            <div>
              <h2>Qualification and background</h2>
              <div>
                {profile.qualification_background
                  ? Parser(profile.qualification_background)
                  : ''}
              </div>

              <h2>Activities of current role</h2>
              <div>
                {profile.current_role ? Parser(profile.current_role) : ''}
              </div>

              <div>
                {profile.additional_information
                  ? Parser(profile.additional_information)
                  : ''}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="column medium-3">
              {' '}
              <h3 style={{ marginTop: '25px' }}>
                {frameworkFullName} {frameworkVersion} / Competencies
              </h3>
            </div>
            <div className="column medium-9 " />
          </div>
          <div className="row">
            <div className="column medium-12">
              <ul className="vf-list legend-inline" style={{ float: 'right' }}>
                {expertise_levels_legend}
              </ul>
            </div>
          </div>
          <hr />
          {competencyView}
        </div>
      ) : (
        'Loading profile'
      )}

      <form onSubmit={e => handlePrint(e)}>
        <div className="submit_fixed">
          <button className="vf-button vf-button--secondary" type="submit">
            Print <i className="icon icon-common icon-print" />
          </button>
          <p style={{ paddingTop: '30px' }}>
            [Please enable background graphics in the print preview in order to
            get better print output]
          </p>
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
