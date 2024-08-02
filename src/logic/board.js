import { WINNER_COMBOSS } from '../constants'

//_Checkear si hay un ganador
export const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOSS) {
      const [a,b,c] = combo
      if(boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]){
        return boardToCheck[a]
      }
    }
    return null //No hay ganador
}


export const checkEndWinner = (newBoard) => {
    /*
      Revisar si hay un empate, 
      si no hay ás espacios vacíos en el tablero    
    */
    return newBoard.every((square) => square !== null)
  }