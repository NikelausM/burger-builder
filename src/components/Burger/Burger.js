import React from 'react'

import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  const transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      let numIngredient = props.ingredients[igKey]
      let arrayOfSizeNumIngredient = [...Array(numIngredient)]
      return arrayOfSizeNumIngredient.map((_, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />
      })
    })
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default burger