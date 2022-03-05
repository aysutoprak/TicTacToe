import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "tachyons";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board_div">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function Title(props) {
  return <h1>{props.title}</h1>;
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      pcmode: false,
      play: true,
      board: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    console.log("pc mode", this.state.pcmode);
    console.log("xIsNext", this.state.xIsNext);
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

    // if (this.state.pcmode) {
    //   if (!this.state.xIsNext) {
    //     console.log("ilk if içinde");
    //     squares[i] = this.state.xIsNext ? "X" : "O";
    //     this.setState({
    //       history: history.concat([
    //         {
    //           squares: squares,
    //         },
    //       ]),
    //       stepNumber: history.length,
    //       xIsNext: !this.state.xIsNext,
    //     });
    //   }
    // } else {
    //   console.log("else içinde");
    //   squares[i] = this.state.xIsNext ? "X" : "O";
    //   this.setState({
    //     history: history.concat([
    //       {
    //         squares: squares,
    //       },
    //     ]),
    //     stepNumber: history.length,
    //     xIsNext: !this.state.xIsNext,
    //   });
    // }
  }

  printhappy() {
    const hh = this.state.history.slice(0, this.state.stepNumber + 1);
    const cc = hh[hh.length - 1];
    const squares = cc.squares.slice();
    let availableList = [];
    if (!this.state.xIsNext) {
      for (let j = 0; j < squares.length; j++) {
        if (squares[j] === null) {
          availableList.push(j);
        }
      }
    }
    console.log("state of pcmode", this.state.pcmode);
    if (this.state.pcmode) {
      let rand = Math.floor(Math.random() * availableList.length);
      let xyz = availableList[rand];
      console.log("the list is: ", availableList);
      // console.log("the rand is: ", rand);
      // console.log("the xyz value is: ", xyz);

      this.sleep(2000).then(() => {
        this.handleClick(xyz);
      });
    }

    // squares[xyz] = this.state.xIsNext ? "X" : "O";
    // if (calculateWinner(squares) || squares[xyz]) {
    //   return;
    // }
    // this.setState({
    //   history: hh.concat([
    //     {
    //       squares: squares,
    //     },
    //   ]),
    //   stepNumber: hh.length,
    //   xIsNext: !this.state.xIsNext,
    // });
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  pcmodeTrue() {
    this.setState({
      pcmode: true,
    });
    console.log("pc mode is true now");
  }

  pcmodeFalse() {
    this.setState({
      pcmode: false,
    });
    console.log("pc mode is false now");
  }

  clickedOnGameBoardT() {
    this.setState({
      board: true,
    });
    console.log("Clicked on gameboard is true now");
  }

  clickedOnGameBoardF() {
    this.setState({
      board: false,
    });
    console.log("Clicked on gameboard is false now");
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var statusid = document.getElementById("statusid");

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
      statusid.classList.toggle("thestatuswin");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (statusid && !winner) {
      statusid.classList.remove("thestatuswin");
    }

    console.log("using pc mode", this.state.pcmode);
    if (!this.state.xIsNext && this.state.pcmode && this.state.board) {
      this.printhappy();
      console.log("inside the state function");
    }

    return (
      <div className="tc hot-pink">
        <Title className="titles" title="Tic-Tac-Toe" />
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => {
                this.handleClick(i);
                this.clickedOnGameBoardT();
              }}
            />
          </div>
          <button
            className="b1"
            onClick={() => {
              this.pcmodeFalse();
              this.clickedOnGameBoardF();
            }}
          >
            Normal
          </button>
          <button
            className="b2"
            onClick={() => {
              this.pcmodeTrue();
              this.clickedOnGameBoardF();
            }}
          >
            PC
          </button>
          <div className="game-info">
            <div className="thestatus" id="statusid">
              {status}
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
