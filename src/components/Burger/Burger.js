import React from 'react'
import { withRouter } from 'react-router-dom'

import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  // console.log(props)
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      let numIngredient = props.ingredients[igKey]
      let arrayOfSizeNumIngredient = [...Array(numIngredient)]
      return arrayOfSizeNumIngredient.map((_, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />
      })
    })
    .reduce((arr, el) => {
      return arr.concat(el)
    }, [])

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default withRouter(burger)