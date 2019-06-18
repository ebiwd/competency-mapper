import React, { Component } from 'react';

import { Link } from 'react-router-dom';

const defaultState = {
  versions: ['draft', '1.5.8', '1.0.2', '0.1.2-beta', '0.1.1-alpha']
  //versions: [] as string[]
};

type State = Readonly<typeof defaultState>;

export default class FrameworkVersions extends Component<{}, State> {
  readonly state = defaultState;

  render() {
    const { versions } = this.state;

    const versionItems = versions.map(version => (
      <li key={version}>
        <Link to={`/framework/${version}/manage/competencies`}>{version}</Link>
        <Link to={`/release-notes/${version}`}>(release notes)</Link>
      </li>
    ));

    return (
      <div>
        Framework versions:
        <ul>{versionItems}</ul>
      </div>
    );
  }
}
