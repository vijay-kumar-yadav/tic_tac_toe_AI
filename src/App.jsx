import React from 'react'
// import Board from './Board'
import BoardWithLevel from './BoardWithLevel';
// import OptionHead from './OptionHead'

const App = () => {
  // let [human,setHuman] = useState('');
  // let available = [];
  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //       available.push([i, j]);
  //     }
  //   }


  return (
    <>
      {/* <OptionHead select = {(val)=>{setHuman(val)}}/> */}
      {/* <Board /> */}
      <BoardWithLevel />
    </>
  )
}

export default App