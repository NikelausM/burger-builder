import React from 'react'

import classes from './Order.module.css'

const order = (props) => {
  const ingredients = []

  for (let ingredientName in props.ingredients) {
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    })
  }

  const ingredientOutput = ingredients.map(ig => {
    let tempIngredientOutput = (<span
      style={{
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 8px',
        border: '1px solid #ccc',
        padding: '5px'
      }}
      key={[props.id, ig.name].join('-')}>{ig.name} ({ig.amount})</span>)
    return tempIngredientOutput
  })

  const date = new Date(props.date)

  const dateFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('en-US', dateFormatOptions)

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
      <p style={{ float: "right" }}>Date Ordered: {formattedDate}</p>
    </div>
  )

}

export default order