import  {useState, useEffect} from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import {Square} from './components/Square.jsx'
import {TURNS} from './constants.js'
import {checkWinner, checkEndWinner} from './logic/board.js'
import {WinnerModal} from './components/WinnerModal.jsx'
import { saveGame, resetGameStorage } from './logic/storage/index.js'


function App() {
  //Estados
  const [board, setBoard] = useState(() =>{
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null) // Si hay algo en el local storage lo devolvemos, si no devolvemos un array de 9 posiciones con null
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X //Si hay algo en el local storage lo devolvemos, si no devolvemos el turno X

    // ?? es el operador de fusión de nulos (nullish coalescing operator)
  })
 

  //Saber quien ha ganado con un estado
  //null es que no hay ganador y false es que hay un empate
  const [winner, setWinner] = useState(null) 

  

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()

  }



  const updateBoard = (index) => {
    //No actualizar la posición si ya está ocupada
    if(board[index] || winner) return
  
    //cambiamos el valor de la casilla
    const newBoard = [...board] //Hacemos una copia del tablero con el rest operator(IMPORTANTÍSIMO)
    newBoard[index] = turn
    setBoard(newBoard)
    
    //cambiamos el turno del jugador
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    //Guardar partida
    saveGame({board: newBoard, turn: newTurn})

    //Comprobamos si hay un ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      confetti() // Lanzamos los confettis si hay un ganador
      setWinner(newWinner) //Las actualización de estado son asíncronas
      
    }else if(checkEndWinner(newBoard)){
      setWinner(false)//Hay un empate
    }

  }

  //Cada ver que haya un ganador, guarda la partida
  useEffect(() => {
    saveGame({board, turn})

  }, [board, turn])


  return (
    <main className='board'>
      <h1>Tres en Raya</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((_, index) => {
            return(
             <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                {board[index]}
                  
                </Square>
             
            )
          })
        }

      </section>

      <section className='turn'>
        <Square isSelected={turn=== TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn=== TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
    
  )
}

export default App
