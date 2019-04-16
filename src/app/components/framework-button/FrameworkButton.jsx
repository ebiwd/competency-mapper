import React from 'react';

import Html from '../../services/html-tags/html-tag';

import { Link } from 'react-router-dom';

function FrameworkButton({ item }) {
  let description = Html.removeTags(item.field_description);
  if (description.length > 120) {
    description = `${description.slice(0, 120).trim()}...`;
  }
  return (
    <div className="column medium-4">
      <Link
        className="column callout"
        data-equalizer-watch
        to={`/framework/${item.title.toLowerCase()}`}
      >
        <img
          className="float-center margin-bottom-medium"
          style={{ height: '6rem' }}
          src={`http://dev-competency-mapper.pantheonsite.io/${
            item.field_logo
          }`}
        />
        <h5>
          {description}
          <i className="icon icon-functional" data-icon=">" />
        </h5>
      </Link>
    </div>
  );
}

export default FrameworkButton;
