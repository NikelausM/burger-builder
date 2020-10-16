import React from 'react'

import classes from './SideDrawer.module.css'
import Logo from 'components/Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import Backdrop from 'components/UI/Backdrop/Backdrop'
import Aux from 'hoc/Auxiliary/Auxiliary'

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close]
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open]
  }

  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(' ')}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuthenticated={props.isAuthenticated} />
        </nav>
      </div>
    </Aux>
  )
}

export default sideDrawer