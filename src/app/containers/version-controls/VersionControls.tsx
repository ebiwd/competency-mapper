import React, { Component } from 'react';

class VersionControls extends Component {
  render() {
    return (
      <div>
        <button className="button">Release new version</button>
        <button className="button">Update release notes</button>
      </div>
    );
  }
}

export default VersionControls;
