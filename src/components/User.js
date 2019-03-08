import React from 'react'
import Cookies from 'universal-cookie';
import { Switch, Route } from 'react-router-dom'
import {withRouter} from 'react-router-dom';
import ManageCompetency from './ManageCompetency';

const $ = window.$;

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            roles:'',
            user:'',
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.roles != nextState.roles || this.state.user != nextState.user ;
    }

    componentDidMount(){
        if(localStorage.getItem('roles')){
            this.setState({roles:localStorage.getItem('roles')});
            this.setState({user:localStorage.getItem('user')});
        }
    }

    handleLogin(e){
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let url = 'https://dev-competency-mapper.pantheonsite.io/user/login?_format=json';
           fetch(url,{
               credentials: 'include',
               method: 'POST',
               'cookies': 'x-access-token',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(
                   {
                       "name": username,
                       "pass": password
                   }
               )
           })
               .then((resp) => resp.json())
               .then((data)=>
               {
                   if(data.message) {
                       //console.log("Bad credentials")
                       alert("Bad credentials")

                   }else{
                       localStorage.setItem('roles', data.current_user.roles);
                       localStorage.setItem('csrf_token', data.csrf_token);
                       localStorage.setItem('logout_token', data.logout_token);
                       localStorage.setItem('user', data.current_user.name);
                       localStorage.setItem('userid', data.current_user.uid);
                       console.log(data);
                       this.setState({roles: localStorage.getItem('roles')});
                       this.setState({user: localStorage.getItem('user')});
                       setTimeout(() => {
                           window.location.reload();
                       },1000)
                   }
               }
               );
            e.preventDefault();
        }

        handleLogout(e){
            fetch('https://dev-competency-mapper.pantheonsite.io/user/logout?csrf_token=' + localStorage.getItem('csrf_token'),{
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((resp) => resp)
                .then((data)=>
                        this.setState({userid:''}),
                        localStorage.removeItem('roles'),
                        localStorage.removeItem('csrf_token'),
                        localStorage.removeItem('logout_token'),
                        this.setState({roles:''}),
                        setTimeout(() => {
                            window.location.reload();
                        },1000),
                );
            e.preventDefault();
        }


    render(){
        let output = '';
        let test = '';
        if(localStorage.getItem('roles')) {
            if(localStorage.getItem('roles').includes('framework_manager')){
                test += 'framework_manager';
            }

            if(localStorage.getItem('roles').includes('content_manager')){
                test += 'content_manager';
            }

            console.log(test);

            output = <div>
                        <ul className="dropdown menu" data-dropdown-menu>
                            {localStorage.getItem('roles').includes('framework_manager')?
                                <li>
                                    <a href="#">Manage Competencies</a>
                                    <ul className="menu vertical">
                                        <li><a href="#/framework/bioexcel/manage/competencies">BioExcel</a></li>
                                        <li><a href="#/framework/corbel/manage/competencies">CORBEL</a></li>
                                        <li><a href="#/framework/iscb/manage/competencies">ISCB</a></li>
                                        <li><a href="#/framework/ritrain/manage/competencies">RITrain</a></li>
                                        <li><a href="#/framework/nhs/manage/competencies">NHS</a></li>
                                    </ul>
                                </li>:''}
                            {localStorage.getItem('roles').includes('content_manager')?
                                <li>
                                    <a href="#/all-training-resources">Manage Training Resources</a>
                                </li>:''}
                            <li>
                                <a href="#"><i className="fas fa-user"></i> Hi {this.state.user}  </a>
                                <ul className="menu vertical">
                                    <li> <a href={"#/user/change/password"}>Change password</a>  </li>
                                    <li> <a href={"#"} onClick={this.handleLogout.bind(this)} >Logout</a>  </li>
                                </ul>
                            </li>
                        </ul>

                    </div>;
        }else{
            output =  <div style={{'width':'500px', 'right':'10px'}}>
                <form id={"login_form"}>
                    <div className="row">
                        <div className="large-5 columns">
                            <input ref={"username"} type={"text"} placeholder={"Username"}/>
                        </div>
                        <div className="large-4 columns">
                            <input ref={"password"} type={"password"} placeholder={"Password"}/>
                        </div>
                        <div className="large-3 columns">
                            <a className={"button"} onClick={this.handleLogin.bind(this)}><i className="fa fa-key" aria-hidden="true"></i> Login</a>
                        </div>
                    </div>
                </form>
            </div>
        }

        return(

           output

        )
    }
}

export default  User;