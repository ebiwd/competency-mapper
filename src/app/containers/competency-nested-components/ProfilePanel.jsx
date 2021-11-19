import React, { Children, Component } from 'react';
import { TabPanel } from 'react-tabs';

class ProfilePanel extends Component {
  render() {
    alert(123);
    return (
      <TabPanel>
        <Children />
      </TabPanel>
    );
  }
}

export default ProfilePanel;
