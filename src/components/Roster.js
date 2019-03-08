import React from 'react'
import { Switch, Route } from 'react-router-dom'


// The Roster component matches one of two different routes
// depending on the full pathname

class Test extends React.Component{
	render(){
		return(
				<div >
					<h2>Testing react from Roster page - router</h2>
				</div>
			);
	}
}

const Roster = () => (
  <Switch>
    <Route exact path='/roster' component={Test} />
    
  </Switch>
)


export default Roster
