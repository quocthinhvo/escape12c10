document.addEventListener("DOMContentLoaded", () => {
  let bombsArray;
  let emptyArray;
  let gameArray;
  let shuffledArray;

  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  let isGamestart = false;
  // init timer
  let timeCount = 0;
  setInterval(setTime, 1000);
  // init sound
  let audioGameover = new Audio("sound/game_over.mp3");
  let audioWin = new Audio("sound/win.mp3");
  let audioClick = new Audio("sound/click.mp3");
  let audioCheckmine = new Audio("sound/check_mine.mp3");
  let audioNomine = new Audio("sound/no_mine.mp3");
  //random int
  function randomInt(start, end) {
    return Math.round(Math.random() * (start - end) + end);
  }
  // config poup
  $("#poupIntro").show();
  $("#popupCloseButton").click(function () {
    $(".hover_bkgr_fricc").hide();
  });
  $(".hover_bkgr_fricc").click(function () {
    $(".hover_bkgr_fricc").hide();
  });

  // ngẫu nhiên câu chào
  document.getElementById("introStr").innerHTML =
    introStr[randomInt(0, introStr.length - 1)];

  function setTime() {
    if (!isGameOver & isGamestart) {
      ++timeCount;
      document.getElementById("time-count").innerHTML = timeCount;
      document.getElementById("ftime").value = timeCount;
    }
  }

  //fucntion play sound
  function soundGameover() {
    audioGameover.play();
  }
  function soundWin() {
    audioWin.play();
  }
  function soundClick() {
    audioClick.play();
  }
  function soundCheckmine() {
    audioCheckmine.play();
  }
  function soundNomine() {
    audioNomine.play();
  }

  //create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    //get shuffled game array with random bombs
    bombsArray = Array(bombAmount).fill("bomb");
    emptyArray = Array(width * width - bombAmount).fill("valid");
    gameArray = emptyArray.concat(bombsArray);
    shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      // square.classList.add(shuffledArray[i]);
      square.classList.add("valid");
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener("click", function (e) {
        click(square);
      });

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (shuffledArray[i] == "valid") {
        if (i > 0 && !isLeftEdge && shuffledArray[i - 1] == "bomb") total++;
        if (i > 9 && !isRightEdge && shuffledArray[i + 1 - width] == "bomb")
          total++;
        if (i > 10 && shuffledArray[i - width] == "bomb") total++;
        if (i > 11 && !isLeftEdge && shuffledArray[i - 1 - width] == "bomb")
          total++;
        if (i < 98 && !isRightEdge && shuffledArray[i + 1] == "bomb") total++;
        if (i < 90 && !isLeftEdge && shuffledArray[i - 1 + width] == "bomb")
          total++;
        if (i < 88 && !isRightEdge && shuffledArray[i + 1 + width] == "bomb")
          total++;
        if (i < 89 && shuffledArray[i + width] == "bomb") total++;
        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  //add Flag with right click
  function addFlag(square) {
    isGamestart = true;
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = " 🍩";
        soundCheckmine();
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        soundNomine();
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  }

  //click on square actions
  function click(square) {
    isGamestart = true;
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (shuffledArray[currentId] == "bomb") {
      gameOver(square);
    } else {
      soundClick();
      let total = square.getAttribute("data");
      square.innerHTML = '<img src="skin/stu/' + randomInt(1, 44) + '.png">';
      if (total != 0) {
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId - width)].id;
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //game over
  function gameOver(square) {
    result.innerHTML = "Thua rồi nha bạn";
    document.getElementById("gameoverStr").innerHTML =
      gameoverStr[randomInt(0, winStr.length - 1)];
    $("#poupGameover").show();
    soundGameover();
    isGameOver = true;

    //show ALL the bombs
    squares.forEach((square) => {
      if (shuffledArray[square.id] == "bomb") {
        square.innerHTML = '<img src="skin/tea/' + randomInt(45, 65) + '.png">';
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains("flag") && shuffledArray[i] == "bomb") {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = "Thắng rồi đó";
        document.getElementById("winStr").innerHTML =
          winStr[randomInt(0, winStr.length - 1)];
        $("#poupWin").show();
        soundWin();
        isGameOver = true;
      }
    }
  }
});
