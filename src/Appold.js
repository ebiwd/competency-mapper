import React, { Component } from 'react';
import ReactDOM from 'react';
import data from './test.json';
class Item extends React.Component {
  render() {
    return <li>
        { this.props.name }
        { this.props.children }
    </li>
  }
}

class List extends React.Component {
  constructor() {
    super();
      
  }
  
  list(data) {
    const children = (items) => {
      if (items) {
        return <ul>{ this.list(items) }</ul>
      }
    }
    
    return data.map((node, index) => {
      return <Item key={ node.id } name={ node.name }>
        { children(node.items) }
      </Item>
    })
  }
  
  render() {
    return <ul>
      { this.list(this.props.data) }
    </ul>
  }

render()
{
  return(
  <List data={ data } />,
  document.getElementById('container')
  )

}

}

export default Item; 
