import React, { useState, useEffect } from 'react';

import user_icon from './user_icon.png';
import { apiUrl } from '../services/http/http';

const PathwaysList = props => {
  const frameworkName = props.framework;
  const [pathways, setPathways] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/${frameworkName}/pathways/?_format=json&timestamp=${Date.now()}`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setPathways(findresponse);
        });
    };

    fetchData();
  }, [frameworkName]);

  const checkUserAccess = () => {
    if (localStorage.getItem('roles')) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {checkUserAccess() === true ? (
        <a
          style={{ float: 'right' }}
          href={`${apiUrl}/node/add/learning_pathway`}
        >
          <button className="vf-button vf-button--primary vf-button--sm">
            Add new learning pathway
          </button>
        </a>
      ) : (
        ''
      )}
      <div className="vf-grid vf-grid__col-3">
        {pathways
          ? pathways.map((pathway, index) => {
              if (!checkUserAccess()) {
                if (pathway.publishing_status === true) {
                  return (
                    <div>
                      <article className="vf-profile vf-profile--very-easy vf-profile--large vf-profile--block">
                        {pathway.image[0] ? (
                          <div className={pathway.publishing_status}>
                            <img
                              alt="profile"
                              src={pathway.image[0].url}
                              className="vf-profile__image"
                            />
                          </div>
                        ) : (
                          <img
                            alt="pathway"
                            src={user_icon}
                            className="vf-profile__image"
                          />
                        )}
                        <h3 className="vf-profile__title">
                          {pathway.title ? (
                            <a
                              className="vf-profile__link"
                              href={`${pathway.url_alias}`}
                            >
                              {pathway.title}
                            </a>
                          ) : (
                            'Title'
                          )}
                        </h3>
                      </article>
                    </div>
                  );
                }
              } else {
                return (
                  <div>
                    <article
                      className={`vf-profile vf-profile--very-easy vf-profile--large vf-profile--block ${
                        pathway.publishing_status ? 'Live' : 'Draft'
                      }`}
                    >
                      {pathway.image[0] ? (
                        <div>
                          <img
                            alt="profile"
                            src={pathway.image[0].url}
                            className="vf-profile__image"
                          />
                        </div>
                      ) : (
                        <img
                          alt="pathway"
                          src={user_icon}
                          className="vf-profile__image"
                        />
                      )}
                      <h3 className="vf-profile__title">
                        {pathway.title ? (
                          <a
                            className="vf-profile__link"
                            href={`${pathway.url_alias}`}
                          >
                            {pathway.title}
                          </a>
                        ) : (
                          'Title'
                        )}
                      </h3>
                    </article>
                  </div>
                );
              }
              return null;
            })
          : ''}
      </div>
    </>
  );
};

export default PathwaysList;
