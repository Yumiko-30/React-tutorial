import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        key={i} 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log('Board render called');
    const items = [];
    for (let i = 0; i < 3; i++) {
      let row = [];

      for (let j = 0; j < 3; j++) {
        const num = i * 3 + j;
        row.push(this.renderSquare(num));
      }
      items.push(<div key={i} className="board-row">{row}</div>);
    };

    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          cells: Array(2).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      order: true,
    };
  }

  handleClick(i) {
    console.log('handleClick called');
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const cells = current.cells.slice();
    //ゲーム終了か配置済みセル
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    cells[0] = (i % 3) + 1;
    cells[1] = Math.floor(i / 3) + 1;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          cells: cells,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    console.log('jumpTo called');
    this.setState({
      stepNumber: step,
      //これがあるとジャンプした時点で戻す
      //      history: this.state.history.slice(0, step + 1),
      xIsNext: step % 2 === 0,
    });
  }

  changeOrder() {
    console.log('changeOrder called');
    this.setState({
      order: !this.state.order,
    });
  }
  render() {
    console.log('Game render called');

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const style = move === this.state.stepNumber ? 'bold' : 'normal';

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={{ fontWeight: style }}
          >
            {desc}
          </button>
          {step.cells[0] && (
            <>
              {'  '}
              col:{step.cells[0]} row:{step.cells[1]}
            </>
          )}
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.changeOrder()}>sort</button>
          <div>{status}</div>
          <ol>{this.state.order ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

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

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
