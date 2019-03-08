import React, { Component } from 'react';
import './App.css';
//import data from './test2.json';
 
class App extends Component {
  /*render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          This is my first react.js app <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }*/

  /*render() {
    return (
        <ul>
        {
          data.map(function(competencies){
            return <li>{competencies.id} - {competencies.name}</li>;
          })
        }
        </ul>
    );
  }
}*/


  constructor()
  {
    super();
    this.state={
      data:[],
    }
  }

  componentDidMount()
  {
    fetch('http://dev-competency-mapper.pantheonsite.io/api/bioexcel/competencies?_format=json').
    then((Response)=>Response.json()).
    then((findResponse)=>
        {
          console.log(findResponse)
          this.setState({
            data:findResponse
          })

        })
    }

    render()
    {
      return(
                <div>
                {

                    this.state.data.map((dynamicData, $id) =>
                        <div>
                          <span>
                            {dynamicData.competency}

                            </span>
                        </div>
                        )
                }
                </div>
            )
    }

}
  




export default App; 
