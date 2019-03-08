import React from 'react'
import CompetencyList from './CompetencyList';
const $ = window.$;

class Demo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: '',
        };
        this.handleLogin = this.handleLogin.bind(this);
    }


    handleLogin(){
        return 1;
    }

    render(){
        return (
            <CompetencyList func ={this.handleLogin } />
        )
    }
}

export default Demo;