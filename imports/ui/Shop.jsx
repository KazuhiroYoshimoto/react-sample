import React, { Component, PropTypes } from 'react';

// Shop component - represents a single todo item
export default class Shop extends Component {
  render() {
    return (
      <li>
        <p> {this.props.shop.id} </p>
        <p> {this.props.shop.name} </p>
        <p> {this.props.shop.address} </p>
      </li>
    );
  }
}

Shop.propTypes = {
  // This component gets the shop to display through a React prop.
  // We can use propTypes to indicate it is required
  shop: PropTypes.object.isRequired,
};