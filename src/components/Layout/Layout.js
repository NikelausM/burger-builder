import React from 'react'

import Aux from 'hoc/Auxiliary'
import classes from './Layout.module.css'
import Toolbar from 'components/Navigation/Toolbar/Toolbar'

const layout = (props) => (
  <Aux>
    <Toolbar />
    <main className={classes.Content}>
      {props.children}
    </main>
  </Aux>
)

export default layout