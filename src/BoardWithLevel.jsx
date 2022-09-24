import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Flip from './Flip';
import coin from './coin_flip.mp3'
import useSound from 'use-sound';

var findIndex = (e, available) => {
    for (let i = 0; i < available.length; i++) {
        for (let j = 0; j < 1; j++) {
            if (e[0] === available[i][j] && e[1] === available[i][j + 1]) {
                return i;
            }
        }
    }
    return -1;
};
function equals3(a, b, c) {
    // console.log(a,b,c);
    return a === b && b === c && a !== "";
}
let checkWinner = (grid) => {
    let winner = null;
    // console.log('grid',grid[0][0])
    // horizontal
    for (let i = 0; i < 3; i++) {
        if (equals3(grid[i][0], grid[i][1], grid[i][2])) {
            winner = grid[i][0];
        }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(grid[0][i], grid[1][i], grid[2][i])) {
            winner = grid[0][i];
        }
    }

    // Diagonal
    if (equals3(grid[0][0], grid[1][1], grid[2][2])) {
        winner = grid[0][0];
    }
    if (equals3(grid[2][0], grid[1][1], grid[0][2])) {
        winner = grid[2][0];
    }
    // console.log(available.length,available);
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === "") {
                openSpots++;
            }
        }
    }

    if (winner === null && openSpots === 0) {
        return "tie";
    } else {
        return winner;
    }
};

let available = [];
function setup() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            available.push([i, j]);
        }
    }
}
let ai, human;
let scores;
let Chance = true;
let levelFlag = true;
let easyFlag = false;
// let Chance = false;
const Board = () => {
    let size = 3;
    //new add
    let [play, { stop }] = useSound(coin);
    let [disableSelect, setDisableSelect] = useState(true)
    let [disableLevel, setDisableLevel] = useState(false);
    let [disablePlayer, setDisablePlayer] = useState(false);
    let [disable, setDisable] = useState({ disabled: false });
    let [disableCheck, setDisableCheck] = useState(false);
    let board = new Array(size).fill(null).map(() => new Array(size).fill(""));

    // let rowCSS = ["row1", "row2", "row3"];
    let [grid, setGrid] = useState(board);
    // const [xIsNext, setXisNext] = useState(true);

    //newly add
    function bestMove(grid1) {
        // AI to make its turn
        // console.log(grid1)
        let boardCopy = [...grid1];
        // console.log(boardCopy)
        // console.log(available)
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (boardCopy[i][j] === "") {
                    boardCopy[i][j] = ai;
                    let score = minimax(boardCopy, 0, false);
                    boardCopy[i][j] = "";
                    // console.log(score,bestScore)
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
        // console.log(move.i,move.j)
        boardCopy[move.i][move.j] = ai;
        setGrid(boardCopy);
        available = available.filter((e, index) => {
            return index !== findIndex([move.i, move.j], available);
        });
        // setXisNext(!xIsNext);
    }

    function minimax(boardCopy, depth, isMaximizing) {
        let result = checkWinner(grid);
        // console.log(result);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (boardCopy[i][j] === "") {
                        boardCopy[i][j] = ai;
                        let score = minimax(boardCopy, depth + 1, false);
                        boardCopy[i][j] = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (boardCopy[i][j] === "") {
                        boardCopy[i][j] = human;
                        let score = minimax(boardCopy, depth + 1, true);
                        boardCopy[i][j] = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    const handleClick = (i, j) => {
        const boardCopy = [...grid];
        let result;
        available = available.filter((e, index) => {
            return index !== findIndex([i, j], available);
        });
        // difficulty alter
        // console.log(easyFlag, available.length)
        if (easyFlag && available.length === 6) {
            // console.log('in easyFlag')
            scores = {
                X: human === "X" ? -10 : 10,
                O: human === "X" ? 10 : -10,
                tie: 0,
            };
            // if (levelFlag) {
            //     console.log('SMART')
            //     scores = {
            //         X: human === "X" ? -10 : 10,
            //         O: human === "X" ? 10 : -10,
            //         tie: 0,
            //     };
            // }
            // else {
            //     console.log('DUMB')
            //     scores = {
            //         X: human === "X" ? 10 : -10,
            //         O: human === "X" ? -10 : 10,
            //         tie: 0,
            //     };
            // }
        }

        boardCopy[i][j] = human;
        setGrid(boardCopy);
        if (available.length !== 0)
            bestMove(grid);
        // setXisNext(!xIsNext);

        // console.log('handle',available)
        // console.log(grid)
        result = checkWinner(boardCopy);
        // console.log(result)
        if (result !== null || available.length === 0) {
            console.log(result);
            setDisable({ disabled: true });
        }
    };
    function handleReset() {
        document.location.reload();
        // human = "";
        // ai = "";
        // scores = {};
        // setDisableSelect(true)
        // setDisable({ disabled: false });
        // setDisableCheck(false);
        // let board = new Array(size).fill(null).map(() => new Array(size).fill(""))
    }
    function handleSelectXorO(Human) {
        if (Human !== "Select X or O") {
            setDisableCheck(true);
            human = Human;
            ai = Human === "X" ? "O" : "X";
            if (levelFlag)
                scores = {
                    X: Human === "X" ? -10 : 10,
                    O: Human === "X" ? 10 : -10,
                    tie: 0,
                };
            else {
                scores = {
                    X: Human === "X" ? 10 : -10,
                    O: Human === "X" ? -10 : 10,
                    tie: 0,
                };
            }

            let board = new Array(size)
                .fill(null)
                .map(() => new Array(size).fill(""));
            setup();
            setGrid(board);
            if (Chance)
                bestMove(board);
        }
        return;
    }
    function handleSelectChance(chance) {
        setDisableSelect(false)
        setDisableLevel(true)
        if (chance === 1) {
            Chance = false
        }
        else {
            Chance = true
        }
    }
    function handleSelectLevel(level) {
        setDisableLevel(false)
        setDisablePlayer(true)
        if (level === 1) {
            levelFlag = false;
            easyFlag = true;
        }
        else {
            levelFlag = true;
        }
    }
    // function handleSelectChance(chance){
    //   if(chance ==='Want to play first')
    //   return
    //   if(chance === 'First'){
    //     Chance = true;
    //   }
    // }
    return (
        <>
            <h1 className="text-center m-3" id='title'>TIC <span id="titleSpan">TAC</span> TOE</h1>
            <hr />
            {!disableCheck ? (
                <>
                    {
                        (disableSelect) ?
                            <>
                                <div className="heading">Choose your chance?</div>

                                <div className="players">
                                    <a className="player" onClick={() => handleSelectChance(1)}>
                                        1<sup>st</sup>
                                    </a>
                                    <a className="player" onClick={() => handleSelectChance(2)}>
                                        2<sup>nd</sup>
                                    </a>
                                </div>
                                <div className="heading">Random</div>
                                <Flip handle={(val) => { handleSelectChance(val) }} play={() => { play() }} stop={() => { stop() }} />
                            </> : null
                    }
                    {
                        (disableLevel) ?
                            <>
                                <div className="heading">Choose Level?</div>

                                <div className="players">
                                    <a className="player" onClick={() => handleSelectLevel(1)}>
                                        Easy 👶
                                    </a>
                                    <a className="player" onClick={() => handleSelectLevel(2)}>
                                        Hard 🦁
                                    </a>
                                </div>

                            </> : null
                    }
                    {/* <select className='' >
            
          </select> */}
                    {/* <div className="m-5 d-flex justify-content-center" >
            <div style={{ 'width': '500px' }}>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  handleSelectXorO(e.target.value);
                }}
              >
                <option defaultChecked>Select X or O</option>
                <option>X</option>
                <option>O</option>
              </Form.Select>

            </div>
          </div> */}

                    {
                        (disablePlayer) ?
                            <>
                                <div className="heading">Choose Zero or Cross?</div>

                                <div className="players">
                                    <a className="player" onClick={() => handleSelectXorO('X')}>
                                        X
                                    </a>
                                    <a className="player" onClick={() => handleSelectXorO('O')}>
                                        O
                                    </a>
                                </div>
                            </> : null
                    }
                    {/* <select onChange={(e) => { handleSelectChance(e.target.value) }}>
            <option defaultChecked >Want to play first</option>
            <option>First</option>
            <option>Second</option>
          </select> */}
                </>
            ) : null
            }
            {
                disableCheck ? (
                    <div className="d-grid gap-2 mt-5">
                        {grid.map((row, i) => {
                            return (
                                <div key={i} className="d-flex gap-2  align-self-center mx-auto">
                                    {row.map((col, j) => {
                                        return (
                                            <Button
                                                variant={(grid[i][j] === '') ? "outline-secondary" : (grid[i][j] === human) ? "outline-primary" : 'outline-danger'}
                                                className="button"
                                                style={{ 'fontSize': '50px', "height": '100px', 'width': '100px' }}
                                                key={i + j}
                                                {...disable}
                                                onClick={() => {
                                                    if (findIndex([i, j], available) !== -1) {
                                                        console.log("inside");
                                                        handleClick(i, j);
                                                    } else {
                                                        console.log("outside");
                                                    }
                                                }}
                                            >
                                                {grid[i][j]}
                                            </Button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                        <h2 className="text-center text-danger m-3">
                            {checkWinner(grid) !== null && checkWinner(grid) !== "tie"
                                ? (checkWinner(grid) === human ? "You" : "AI") + " Wins!"
                                : checkWinner(grid) === 'tie' ? "It's a Tie!" : null}
                        </h2>
                    </div>
                ) : null
            }

            {
                disable.disabled ? (
                    <div className="text-center m-3">
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => {
                                handleReset();
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                ) : null
            }
        </>
    );
};

export default Board;
