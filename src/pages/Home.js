import React from 'react';

function Home({ playerPosition }) {
  return (
    <div>
      <h2>Player's Current Position</h2>
      <p>X Coordinate: {playerPosition.curr_x}</p>
      <p>Y Coordinate: {playerPosition.curr_y}</p>
    </div>
  );
}

export default Home;
