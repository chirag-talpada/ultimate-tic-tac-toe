const outerBoard = document.querySelector(".outerBoard");
const allouterCell = [...document.querySelectorAll(".outerCell")];

const x_Class = "cross";
const o_Class = "circle";

let allHoverCell;

const inner_win_Combo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let turn = true;
let selectionFlag = true;
let acticatedCell;

setHover();

outerBoard.addEventListener("click", function (e) {
  let targetedElement = e.target;
  let clikedCell;
  let currentClass = turn ? x_Class : o_Class;

  setHover();

  if (!targetedElement.classList.contains("innerCell")) {
    return;
  }

  if (hasPlayer(targetedElement)) {
    return;
  }

  if (targetedElement.closest(".disabledCell")) {
    return;
  }

  if (targetedElement.closest(".outerCell")) {
    clikedCell = targetedElement.closest(".outerCell").dataset.index;
  }

  acticatedCell = targetedElement.dataset.index;

  if (turn) {
    targetedElement.innerText = "X";
  } else {
    targetedElement.innerText = "O";
  }

  targetedElement.classList.add(currentClass);

  if (turn) {
    let randomCell = hasMark(acticatedCell);

    if (randomCell || !selectionFlag) {
      removeClasses();
      selectionFlag = false;
    } else {
      highlightedActivatedCell(acticatedCell, currentClass);
      selectionFlag = true;
    }
  }

  if (!turn) {
    let randomCell = hasMark(acticatedCell);

    if (selectionFlag || randomCell) {
      selectionFlag = true;
      removeClasses();
    } else {
      highlightedActivatedCell(acticatedCell, currentClass);
    }
  }

  //check inner Board winning condition and pass board Number
  let result = checkInnerWin(clikedCell, currentClass);

  //check draw
  let innerCell = getInnerCells(clikedCell);
  let innerDrawResult = isDraw(innerCell);

  if (result) {
    putMark(clikedCell, currentClass);
    checkOuterWin(currentClass);
  } else if (innerDrawResult) {
    putDraw(clikedCell);
  }

  //check outer draw
  let outerDrawResult = isDraw(allouterCell);

  if (outerDrawResult) {
    alert("draw");
  }

  turn = !turn;
});

//hover effect
function setHover() {
  allHoverCell = [
    ...document.querySelectorAll(".outerCell:not(.disabledCell)"),
  ];

  allHoverCell.forEach((outerCell) => {
    let allInnerCell = [
      ...outerCell.querySelectorAll(".innerBoard .innerCell"),
    ];

    allInnerCell.forEach((cell) => {
      cell.addEventListener("mouseover", function () {
        if (cell.closest(".disabledCell") === null && !hasPlayer(cell)) {
          let currentPlayer = turn ? "X" : "O";
          cell.innerText = currentPlayer;
          cell.style.color = "#0000007a";
        }
      });
    });

    allInnerCell.forEach((cell) => {
      cell.addEventListener("mouseleave", function () {
        if (!hasPlayer(cell)) {
          cell.innerText = "";
        }
        cell.style.color = "black";
      });
    });
  });
}

//numbering inner board
allouterCell.forEach((outerCell, i) => {
  outerCell.setAttribute("data-index", i);

  let allInnerCell = [...outerCell.querySelectorAll(".innerBoard .innerCell")];

  allInnerCell.forEach((innerCell, j) => {
    innerCell.setAttribute("data-index", j);
  });
});

function highlightedActivatedCell(acticatedCell_Index, currentClass) {
  allouterCell.forEach((cell, i) => {
    if (!cell.classList.contains(currentClass)) {
      if (i === Number(acticatedCell_Index)) {
        cell.classList.add("activatedCell");
      } else {
        cell.classList.add("disabledCell");
      }
    }
  });
}

function removeClasses() {
  allouterCell.forEach((cell, i) => {
    if (cell.classList.contains("activatedCell")) {
      cell.classList.remove("activatedCell");
    } else {
      cell.classList.remove("disabledCell");
    }
  });
}

function hasPlayer(element) {
  if (
    element.classList.contains(x_Class) ||
    element.classList.contains(o_Class) ||
    element.classList.contains("drawCell")
  ) {
    return true;
  } else {
    return false;
  }
}

function getInnerCells(index) {
  let innerCell = [
    ...allouterCell[index].querySelectorAll(".innerBoard .innerCell"),
  ];

  return innerCell;
}

function checkInnerWin(clickedBoard_Index, currentClass) {
  let innerCell = getInnerCells(clickedBoard_Index);

  return hasWin(innerCell, currentClass);
}

function checkOuterWin(currentClass) {
  let res = hasWin(allouterCell, currentClass);

  let player = getCurrentPlayer(currentClass);

  if (res) {
    alert(player + " Won the Game");
  }
}

function hasWin(cells, currentClass) {
  return inner_win_Combo.some((win_pattern) => {
    return win_pattern.every((i) => {
      return cells[i].classList.contains(currentClass);
    });
  });
}

function putMark(clickedBoard_Index, currentClass) {
  let winningOuterCell = allouterCell[clickedBoard_Index];

  //put flag to mark cell
  winningOuterCell.classList.add(currentClass);

  //create win checked mark
  let div = document.createElement("div");
  let symbol = getCurrentPlayer(currentClass);
  div.innerText = symbol;
  let color = currentClass === "cross" ? "#3939c5" : "#ed3939";
  div.style.backgroundColor = color;

  div.classList.add("winningInnerBoard", "center");

  winningOuterCell.prepend(div);
}

function hasMark(index) {
  let checkOuterCell = allouterCell[index];

  return hasPlayer(checkOuterCell);
}

function getCurrentPlayer(currentClass) {
  return currentClass === "cross" ? "X" : "O";
}

function isDraw(cells) {
  return cells.every((cell) => {
    return (
      cell.classList.contains(x_Class) ||
      cell.classList.contains(o_Class) ||
      cell.classList.contains("drawCell")
    );
  });
}

function putDraw(clikedCell) {
  let drawOuterCell = allouterCell[clikedCell];

  //put flag to mark cell
  drawOuterCell.classList.add("drawCell");

  //create draw checked mark
  let div = document.createElement("div");
  div.innerText = "draw";
  div.style.backgroundColor = "black";

  div.classList.add("drawBoard", "center");

  drawOuterCell.prepend(div);
}

// background-color: rgb(0 0 0);
// font-size: 25px;
