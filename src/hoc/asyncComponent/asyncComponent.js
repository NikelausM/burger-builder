import React, { Component } from 'react';

/**
 * Accept a functional component, creates a component, then executes function.
 * @param {function} importComponent 
 * @returns {Component} 
 */
const asyncComponent = (importComponent) => {
  return class extends Component {
    state = {
      component: null
    }

    /**
     * If component did mount, executes functional component, then sets component state.
     * @param {void}
     * @returns {void}
     */
    componentDidMount() {
      importComponent()
        .then(cmp => {
          this.setState({ component: cmp.default });
        });
    }

    /**
     * If component state not null, then this component is returned.
     * @param {void}
     * @returns {?string} Component HTML string, or null.
     */
    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }
}

export default asyncComponent;