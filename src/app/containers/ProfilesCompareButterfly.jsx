import React from 'react';
// import { useHistory } from 'react-router-dom';
import 'react-svg-radar-chart/build/css/index.css';
import Collapsible from 'react-collapsible';

export const ProfilesCompareButterfly = props => {
  // let history = useHistory();
  const frameworkName = props.frameworkName;
  const frameworkVersion = props.frameworkVersion;
  // const isGuestProfile = props.isGuestProfile;

  const profile1 = props.profile1;
  const profile2 = props.profile2;
  const framework = props.framework;
  const frameworkInfo = props.frameworkInfo;

  var competencyView = '';
  var expertise_levels = [];
  var expertise_levels_legend = [];
  var attribute_types = [];
  var frameworkFullName = '';
  //var frameworkLogo = '';
  //var frameworkDesc = '';
  var mapping1 = [];
  var mapping2 = [];
  // var user_roles = localStorage.getItem('roles')
  //   ? localStorage.getItem('roles')
  //   : '';
  // var competencies_array = [];
  var expertise_array = [];
  //var profile1_expertise_obj = new Object();
  //var profile2_expertise_obj = new Object();
  var chart_props = [];
  //var leftData = [];
  //var rightData = [];
  var totalLevels = '';

  var includeSummary = [];

  const getExpertise = (competency, profileid) => {
    let mapping = [];
    if (profileid === 'profile1') {
      mapping = mapping1;
    } else {
      mapping = mapping2;
    }

    let obj = mapping.find(o => o.competency === competency);
    if (obj) {
      if (frameworkInfo) {
        // let expertise = frameworkInfo[0].expertise_levels.find(
        //   level => level.id == obj.expertise
        // );

        let frm = frameworkInfo.find(
          info => info.title.toLowerCase() === frameworkName
        );

        let expertise = frm.expertise_levels.find(
          level => level.id === obj.expertise
        );
        totalLevels = frm.expertise_levels.length;
        return expertise;
      }
    } else {
      return null;
    }
  };

  const getAttributeStatus = (attribute, profile) => {
    let mapping = '';
    if (profile === 'profile1') {
      mapping = profile1.profile_mapping;
    } else {
      mapping = profile2.profile_mapping;
    }

    if (mapping) {
      let attribute_check_status = mapping.find(o =>
        o.attributes.find(a => a === attribute)
      );

      return attribute_check_status ? true : false;
    }
  };

  const generateProfileView = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          frameworkFullName = info.title;
          //frameworkLogo = info.logo[0].url;
          //frameworkDesc = info.description;
          info.expertise_levels.map(
            (level, key) => (expertise_array[key] = level.id) //(expertise_levels[level.id] = level.title)
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
      return null;
    });

    if (profile1) {
      mapping1 = profile1.profile_mapping;
    }

    if (profile2) {
      mapping2 = profile2.profile_mapping;
    }

    if (frameworkInfo) {
      frameworkInfo.map(framework => {
        if (framework.title === frameworkName) {
          framework.expertise_levels.map((level, key) => {
            expertise_array[key] = level.id;
            return null;
          });
          totalLevels = framework.expertise_levels.length;
        }
        return null;
      });
    }

    if (framework) {
      competencyView = framework.map((item, frmIndex) =>
        item.domains.map((domain, domainIndex) =>
          domain.competencies.map((competency, compIndex) => {
            let profile1Expertise = getExpertise(competency.id, 'profile1');
            let profile2Expertise = getExpertise(competency.id, 'profile2');

            if (profile1Expertise && profile2Expertise) {
              includeSummary.push(
                profile1Expertise.rating_level < profile2Expertise.rating_level
                  ? competency.id
                  : null
              );
            } else if (!profile1Expertise && !profile2Expertise) {
              includeSummary.push(null);
            } else if (!profile1Expertise && profile2Expertise) {
              includeSummary.push(competency.id);
            }

            let width1 = profile1Expertise
              ? 100 / ((totalLevels - 1) / profile1Expertise.rating_level)
              : 0;
            let margin1 = 100 - width1;
            margin1 = margin1 === 100 ? 88 : margin1;

            let width2 = profile2Expertise
              ? 100 / ((totalLevels - 1) / profile2Expertise.rating_level)
              : 0;
            let floatRight = width2 === 0 ? 'none' : 'right';

            return (
              <div key={compIndex}>
                <div className="vf-grid vf-grid__col-5">
                  <div className="vf-grid__col--span-3">
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
                  <div className="vf-grid__col--span-1">
                    <div className="fillerbg">
                      <div
                        className="fillerLeft"
                        style={{
                          width: width1 + '%',
                          marginLeft: margin1 + '%'
                        }}
                      >
                        <span
                          style={{ position: 'relative' }}
                          className="rating_level_number"
                        >
                          {profile1Expertise
                            ? profile1Expertise.rating_level
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="vf-grid__col--span-1">
                    <div className="fillerbg">
                      <div
                        className="fillerRight"
                        style={{ width: width2 + '%', display: 'flow-root' }}
                      >
                        <span
                          style={{ float: floatRight }}
                          className="rating_level_number"
                        >
                          {profile2Expertise
                            ? profile2Expertise.rating_level
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
                        <span className="icon icon-common icon-angle-right icon-custom" />
                      </div>
                    }
                    triggerWhenOpen={
                      <div className="open-close-title">
                        <span className="icon icon-common icon-angle-down icon-custom" />
                      </div>
                    }
                  >
                    {attribute_types.map((attribute_type, typeIndex) => {
                      return (
                        <React.Fragment key={typeIndex}>
                          <p style={{ paddingLeft: '20px', marginTop: '10px' }}>
                            <strong> {attribute_type} </strong>
                          </p>
                          <div className="vf-grid vf-grid__col-5">
                            {competency.attributes
                              .filter(
                                attribute => attribute.type === attribute_type
                              )
                              .map((attribute, attrIndex) => {
                                return (
                                  <React.Fragment key={attrIndex}>
                                    <span
                                      className="vf-grid__col--span-3"
                                      style={{ paddingLeft: '20px' }}
                                    >
                                      {attribute.title}
                                    </span>

                                    <div className="vf-grid__col--span-1">
                                      {getAttributeStatus(
                                        attribute.id,
                                        'profile1'
                                      ) ? (
                                        <i className="icon icon-common icon-check" />
                                      ) : (
                                        '-'
                                      )}
                                    </div>
                                    <div className="vf-grid__col--span-1">
                                      {getAttributeStatus(
                                        attribute.id,
                                        'profile2'
                                      ) ? (
                                        <i className="icon icon-common icon-check" />
                                      ) : (
                                        '-'
                                      )}
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </Collapsible>
                </div>
              </div>
            );
          })
        )
      );
    }
  };
  if (profile1) {
    chart_props[0] = {
      key: profile1.id,
      label: profile1.title
    };
  }

  if (profile2) {
    chart_props[1] = {
      key: profile2.id,
      label: profile2.title
    };
  }

  const handlePrint = e => {
    e.preventDefault();
    window.print();
  };

  // const handleSummary = e => {
  //   e.preventDefault();
  //   history.push({
  //     pathname: `/framework/${frameworkName}/${frameworkVersion}/profiles/compare/guest/summary`,
  //     state: {
  //       profileJobTitle: profile1.job_title,
  //       includeSummary: includeSummary
  //     }
  //   });
  // };

  return (
    <div id="">
      {generateProfileView()}

      <p>&nbsp; </p>
      <div className="vf-grid vf-grid__col-5">
        <div className="vf-grid__col--span-3">
          <h3>
            {frameworkFullName} {frameworkVersion} / Competencies
          </h3>
        </div>
        <div className="vf-grid__col--span-1">
          <h3>{profile1.job_title}</h3>
        </div>
        <div className="vf-grid__col--span-1">
          <h3>{profile2.job_title}</h3>
        </div>
      </div>

      <hr />
      <div className="vf-grid vf-grid__col-5">
        <div className="vf-grid__col--span-3" />
        <div className="vf-grid__col--span-1">
          <span>High</span> <span style={{ float: 'right' }}> Low</span>
        </div>
        <div className="vf-grid__col--span-1">
          <span>Low</span> <span style={{ float: 'right' }}> High</span>
        </div>
      </div>

      <div>{competencyView}</div>
      <div className="vf-grid">
        <div />
        {/* <div style={{ textAling: 'center' }}>
          {isGuestProfile ? (
            <button
              to={'#'}
              className="vf-button"
              onClick={e => handleSummary(e)}
            >
              Summary <i className="icon-common icon-list" />
            </button>
          ) : (
            ''
          )}
        </div> */}
        <div style={{ textAling: 'center' }} className="submit_fixed">
          <button
            href="#"
            className="vf-button vf-button--secondary"
            onClick={e => handlePrint(e)}
          >
            Print <i className="icon icon-common icon-print" />
          </button>
          <p style={{ paddingTop: '30px' }}>
            [Please enable background graphics in the print preview in order to
            get better print output]
          </p>
        </div>
        <div />
      </div>
    </div>
  );
};

export default ProfilesCompareButterfly;
