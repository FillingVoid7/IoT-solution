import React from 'react'
import TestComp from '../components/TestComp'
function Test() {
    const img = '`https://images.unsplash.com/photo-1634210000000-0b1b3b1b3b1b`'
    const text = 'This is a test'
  return (
    <div>
      <TestComp img={img} text={text} />
    </div>
  )
}

export default Test