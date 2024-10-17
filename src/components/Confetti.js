import React from 'react'
import Confetti from 'react-confetti'

export default () => {
  let width = 1000, height = 1000
  return (
    <Confetti
      width={width}
      height={height}
    />
  )
}