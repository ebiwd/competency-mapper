import React from 'react'
import Cookies from 'universal-cookie';
import { Switch, Route } from 'react-router-dom'
import {withRouter} from 'react-router-dom';
import ManageCompetency from './ManageCompetency';

const $ = window.$;

class changePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            roles: '',
            user: '',
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handlePasswordChange(e){
        let old = this.refs.old.value;
        let new1 = this.refs.new1.value;
        let uid = localStorage.getItem('userid');
        fetch('https://dev-competency-mapper.pantheonsite.io/user/'+uid+'/password?_format=json',{
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': localStorage.getItem('csrf_token'),
            },
            body: JSON.stringify({
                "_links": {
                    "type": {
                        "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/user/user"
                    }
                },
                "old":[
                    {
                        "value": old
                    }
                ],
                "new":[
                    {
                        "target_id": new1
                    }
                ]
            })
        })
            .then((resp) => resp)
            .then((data)=>
                setTimeout(() => {
                    alert("Password changed successfully"),
                    window.location.reload();
                },1000),
            );
        e.preventDefault();
    }

    checkUser(){
        if(!localStorage.getItem('roles')){
            this.props.history.push("/");
        }
    }

    render(){
        this.checkUser();
        return(
            <div>
                <h3>Change password:</h3>
                <form id={"passChange"} >
                    <input type={"password"} ref={"old"} placeholder={"Old password"} />
                    <input type={"password"} ref={"new1"} placeholder={"New password"}/>
                    <input type={"password"}  placeholder={"Confirm new password"}/>
                    <input type={"button"} className={"button"} onClick={this.handlePasswordChange.bind(this)} value={"Submit"} />
                </form>
            </div>
        )
    }
}

const changePass = () => (
    <Switch>
        <Route exact path='/user/change/password' component={changePassword} />
    </Switch>
);

export default changePass;