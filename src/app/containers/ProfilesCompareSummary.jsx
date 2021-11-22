import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
//import { Link, Redirect } from 'react-router-dom';
import Collapsible from 'react-collapsible';
//import summary from './bioexcel_2_profiles_compare_summary.json';

export const ProfilesCompareSummary = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];

  const [framework, setFramework] = useState();
  const [frameworkInfo, setFrameworkInfo] = useState();
  const location = useLocation();
  const [summary, setSummary] = useState();

  let profileJobTitle = location.state.profileJobTitle;
  let includeSummary = location.state.includeSummary;
  var competencyView = '';
  var attribute_types = [];

  const getAorAn = () => {
    const vowels = 'aeiouAEIOU';
    return vowels.indexOf(profileJobTitle[0]) === -1 ? 'a' : 'an';
  };

  useEffect(() => {
    const fetchData = async () => {
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

      await fetch(
        `${apiUrl}/api/profile_summary/${frameworkName}/${frameworkVersion}?_format=json`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setSummary(findresponse);
        });
    };
    fetchData();
  }, [profileId, frameworkVersion, frameworkName]);

  if (summary) {
    console.log(summary);
  }

  const findResources = competency_id => {
    if (summary) {
      let test = summary.map(item => {
        if (item.id === competency_id) {
          return item.resources.map(resource => {
            return (
              <li>
                <a
                  href={resource.resourceLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {' '}
                  {resource.resourceName}{' '}
                </a>
              </li>
            );
          });
        }
        return null;
      });
      return test;
    }
  };

  const generateSummary = () => {
    if (frameworkInfo) {
      frameworkInfo.map(info => {
        if (info.title.toLowerCase() === frameworkName) {
          //frameworkFullName = info.title;
          //frameworkLogo = info.logo[0].url;
          //frameworkDesc = info.description;
          info.attribute_types.map(
            attribute => (attribute_types[attribute.id] = attribute.title)
          );
        }
        return null;
      });
    }

    if (framework) {
      competencyView = framework.map(item =>
        item.domains.map(domain => (
          <div>
            <div className="row callout">
              <div className="column medium-8 ">
                <h5>{domain.title}</h5>{' '}
              </div>
              <div className="column medium-4 ">
                <h5>Learning Resources</h5>
              </div>
            </div>
            {domain.competencies.map(competency =>
              includeSummary.indexOf(competency.id) !== -1 ? (
                <div>
                  <div id={competency.id} className="row">
                    <div className="column medium-8">
                      <span className="competency_title">
                        <div>
                          <Collapsible
                            trigger={
                              <div className="open-close-title">
                                <i className="icon icon-common icon-angle-right icon-custom" />{' '}
                                {competency.title}
                              </div>
                            }
                            triggerWhenOpen={
                              <div className="open-close-title">
                                <i className="icon icon-common icon-angle-down icon-custom" />{' '}
                                {competency.title}
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
                                      attribute =>
                                        attribute.type === attribute_type
                                    )
                                    .map(attribute => {
                                      return (
                                        <div className="row attribute_align">
                                          <div className="column medium-8">
                                            {attribute.title}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              );
                            })}
                          </Collapsible>
                        </div>
                      </span>
                    </div>
                    <div className="column medium-4">
                      <ul>{findResources(competency.id)}</ul>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )
            )}
          </div>
        ))
      );
    }
  };

  // const handlePrint = () => {
  //   window.print();
  // };

  return (
    <div>
      {generateSummary()}
      <h2>Summary of learning resources</h2>
      <p className="lead">
        Based on the comparison of your profile, the following are the suggested
        learning resources to help develop your career, if you want to become{' '}
        {getAorAn()} {profileJobTitle}
      </p>
      {competencyView}
    </div>
  );
};

export const SummaryPath = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profiles/compare/guest/summary"
      component={ProfilesCompareSummary}
    />
  </Switch>
);

export default SummaryPath;
