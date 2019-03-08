import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class Sidebar extends React.Component{

    constructor(props){
        super(props);
        this.state = {data: []};
    }


    componentDidMount()
    {
        fetch('http://drupal8/api/frameworks')
            .then((Response)=>Response.json())
            .then((findresponse)=>
            {
                this.setState({
                    data:findresponse,
                })
            })
    }

    render(){
        let data = this.state.data;

        return(
            <div>
                <div className={"callout analytics-content-left"}>
                    <h4> Competency Frameworks  </h4>
                    <ul>
                    {
                        data.map((item, id) =>
                            <li key={id}>
                                <div>

                                        <h6>{item.title}</h6>
                                        <img src={"http://drupal8"+item.field_logo} width={"100px"} style={{"text-decoration":"none"}}/>
                                        <p>This framework contains competencies relevant to BioExcel domains and mapped training resources
                                            <a href={"/framework/"+item.title.toLowerCase()} className={"readmore"}> Learn more</a>
                                        </p>

                                </div>
                            </li>
                        )
                    }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
