import React from 'react'

import classes from './Toolbar.module.css'
import Logo from 'components/Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <div>MENU</div>
    <div className={classes.Logo}>
      <Logo height="80%" />
    </div>
    <nav>
      <NavigationItems />
    </nav>
  </header>
)

export default toolbar