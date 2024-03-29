import React from 'react';

import { apiUrl } from '../services/http/http';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      roles: '',
      user: ''
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handlePasswordChange(e) {
    let old = this.refs.old.value;
    let new1 = this.refs.new1.value;
    let uid = localStorage.getItem('userid');
    fetch(`${apiUrl}/user/` + uid + '?_format=json', {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': localStorage.getItem('csrf_token')
      },
      body: JSON.stringify({
        pass: [
          {
            existing: old,
            value: new1
          }
        ]
      })
    })
      .then(resp => resp)
      .then(data =>
        setTimeout(() => {
          alert('Password changed successfully');
          window.location.reload();
        }, 1000)
      );
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <h3>Change password:</h3>
        <form className="vf-form" id={'passChange'}>
          <input
            className="vf-form__input"
            type={'password'}
            ref={'old'}
            placeholder={'Old password'}
          />
          <input
            className="vf-form__input"
            type={'password'}
            ref={'new1'}
            placeholder={'New password'}
          />
          <input
            className="vf-form__input"
            type={'password'}
            placeholder={'Confirm new password'}
          />
          <input
            type={'button'}
            className={'vf-button vf-button--sm vf-button--primary'}
            onClick={this.handlePasswordChange.bind(this)}
            value={'Submit'}
          />
        </form>
      </div>
    );
  }
}

export default ChangePassword;
