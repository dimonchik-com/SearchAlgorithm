export const hasValidPath = room => {
  const currentPosition = {
    indexMove: 0,
    row: 0,
    visitedPlaces: new Set(),
    possibleTurn: new Set()
  };

  const endRoom = nextTurn => {
    const currentRow = room[room.length - 1];
    if (
      nextTurn.indexMove === currentRow.length - 1 &&
      nextTurn.row === room.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getNextTurn = () => {
    //получаем любой ход
    if (currentPosition.possibleTurn.size) {
      const it = currentPosition.possibleTurn.values();
      const first = it.next();
      const value = first.value;
      currentPosition.possibleTurn.delete(value);
      return value;
    }
    return null;
  };

  const isInVisitedplaces = visitedPlaces => {
    for (let element of currentPosition.visitedPlaces) {
      if (
        element.indexMove === visitedPlaces.indexMove &&
        element.row === visitedPlaces.row
      )
        return true;
    }
    return false;
  };

  const findPath = () => {
    const { indexMove, row } = currentPosition;
    currentPosition.visitedPlaces.add({ indexMove: indexMove, row: row });

    const [prevRow, prevRowIndex] = [room[row - 1], row - 1];
    const [currentRow, currentRowIndex] = [room[row], row];
    const [nextRow, nextRowIndex] = [room[row + 1], row + 1];

    // ищем в следующем ряду
    if (nextRow) {
      const fromWeGoing =
        nextRow[indexMove - 1] !== undefined ? indexMove - 1 : indexMove;
      const whereWeGoing =
        nextRow[indexMove + 1] !== undefined ? indexMove + 1 : indexMove;
      for (let step = fromWeGoing; step <= whereWeGoing; step++) {
        const positionCopy = { indexMove: step, row: nextRowIndex };
        if (nextRow[step] && !isInVisitedplaces(positionCopy)) {
          currentPosition.possibleTurn.add({
            indexMove: step,
            row: nextRowIndex
          });
        }
      }
    }

    // ищем в текущем ряду
    const fromWeGoing =
      currentRow[indexMove - 1] !== undefined ? indexMove - 1 : indexMove;
    const whereWeGoing =
      currentRow[indexMove + 1] !== undefined ? indexMove + 1 : indexMove;
    for (let step = fromWeGoing; step <= whereWeGoing; step++) {
      const positionCopy = { indexMove: step, row: currentRowIndex };
      if (currentRow[step] && !isInVisitedplaces(positionCopy)) {
        currentPosition.possibleTurn.add({
          indexMove: step,
          row: currentRowIndex
        });
      }
    }

    // ищем в предыдущем ряду
    if (prevRow) {
      const fromWeGoing =
        prevRow[indexMove - 1] !== undefined ? indexMove - 1 : indexMove;
      const whereWeGoing =
        prevRow[indexMove + 1] !== undefined ? indexMove + 1 : indexMove;
      for (let step = fromWeGoing; step <= whereWeGoing; step++) {
        const positionCopy = { indexMove: step, row: prevRowIndex };
        if (prevRow[step] && !isInVisitedplaces(positionCopy)) {
          currentPosition.possibleTurn.add({
            indexMove: step,
            row: prevRowIndex
          });
        }
      }
    }

    const nextTurn = getNextTurn();
    if (nextTurn) {
      if (endRoom(nextTurn)) {
        return true;
      } else {
        currentPosition.indexMove = nextTurn.indexMove;
        currentPosition.row = nextTurn.row;
        return findPath();
      }
    }
    return false;
  };

  return findPath();
}; // return boolean;
