function startMinesweeper(minesCount) {
    let remainingMines = minesCount;
    let seconds = 0;
    let gameStarted = false;
    let gameFinished = false;
    let timer;

    $("body").empty().append(
    "<div class='card text-center'>" +
        "<header id='header' class='card-header'>" +
            "<span>Remaining mines: <span id='remainingMines'>" + remainingMines + "</span></span>" +
            "<span> Time: <span id='stopwatch'>" + 0 +"</span></span>" +
        "</header>" +
        "<section id='main' class='card-body'></section>" +
        "<footer id='footer' class='card-footer'>" +
            "<button id='newMinesweeper'>New game</button>" +
            "<input id='newMines' type='number' min='10' max='100' value='10'/>" +
        "</footer>" +
    "</div>"
    );

    $("#newMinesweeper").click(function() {
        let newMines = $("#newMines").val();
        clearInterval(timer);
        startMinesweeper(newMines);
    });

    let startTimer = function startTimer() {
        timer = setInterval(function() {
            seconds++;
            $('#stopwatch').text(seconds);
            if (seconds === 999) {
                clearInterval(timer);
            }
            if (gameStarted === false) {
                clearInterval(timer);
            }
        }, 1000)
    };

    //check amount of mines to be in range
    $(function () {
        $("#newMines").keydown(function () {
            // Save old value.
            if (!$(this).val() || (parseInt($(this).val()) <= 100 && parseInt($(this).val()) >= 1))
                $(this).data("old", $(this).val());
        });
        $("#newMines").keyup(function () {
            // Check correct, else revert back to old value.
            if (!$(this).val() || (parseInt($(this).val()) <= 100 && parseInt($(this).val()) >= 1))
                ;
            else
                $(this).val($(this).data("old"));
        });
    });

    let mines = minesCount;
    let fieldWidth = Math.round(Math.sqrt(mines*6));

    let FIELD = new Array(fieldWidth);
    for (let i = 0; i < FIELD.length; i++) {
        FIELD[i] = new Array(fieldWidth);
    }

    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.isOpen = false;
            this.isMarked = false;
            this.hasBomb = false;
            this.bombsNear = null;
        }

        addCellsAround() {
            let cells = [], i, j;
            for (i = this.x-1; i <= this.x+1; i++) {
                for (j = this.y-1; j <= this.y+1; j++) {
                    if(i>=0 && j>=0 && i<FIELD.length && j<FIELD.length && !((i === this.x) && (j === this.y))) {
                        cells.push({x: i, y: j});
                    }
                }
            }
            return cells;
        }

        calculateBombsAround() {
            let cells = this.addCellsAround();
            cells = cells.filter((el) => FIELD[el.y][el.x].hasBomb);
            this.bombsNear = cells.length;
        }

        getClosedUnmarkedCellsAround() {
            let cells = this.addCellsAround();
            cells = cells.filter((el) => !FIELD[el.y][el.x].isOpen && !FIELD[el.y][el.x].isMarked);
            return cells;
        }

        getMarkedCellsAround() {
            let cells = this.addCellsAround();
            cells = cells.filter((el) => FIELD[el.y][el.x].isMarked);
            return cells;
        }
    }

    function placeBombs() {
        for(let i = 0; i < mines; i++) {
            let x = Math.floor((Math.random()*fieldWidth));
            let y = Math.floor((Math.random()*fieldWidth));
            while (FIELD[y][x].hasBomb) {
                x = Math.floor((Math.random()*fieldWidth));
                y = Math.floor((Math.random()*fieldWidth));
            }
            FIELD[y][x].hasBomb = true;
        }
    }

    for(let i = 0; i < fieldWidth; i++) {
        for(let j = 0; j < fieldWidth; j++) {
            FIELD[j][i] = new Cell(i, j);
        }
    }

    placeBombs();

    FIELD.forEach(rowsOfCells => rowsOfCells.forEach(cell => {
        cell.calculateBombsAround();
    }));

    FIELD.forEach(rowsOfCells => {
        rowsOfCells.forEach(cell => {
            $("#main").append(
                "<button id='btn_"+cell.x+"_"+cell.y+"' style='width: 30px; height: 30px' />"
            );
            clickFunction(cell.x, cell.y);
            markFunction(cell.x, cell.y);
            middleClickFunction(cell.x, cell.y);
        });
        $("#main").append("<br>");
    });

    function clickFunction(x, y) {
        $("#btn_"+x+"_"+y).click(function() {
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
            let checkedCell = FIELD[y][x];
            if (!checkedCell.isMarked) {
                if (checkedCell.hasBomb) {
                    $(this).addClass("disabled");
                    $(this).text("X");
                    checkedCell.isOpen = true;
                    FIELD.forEach(rowsOfCells => rowsOfCells.forEach(cell => {
                        if (!cell.isOpen) {
                            $("#btn_"+cell.x+"_"+cell.y).click();
                        }
                    }));
                    clearInterval(timer);
                    if (!gameFinished) {
                        gameFinished = true;
                        $("#main").append(
                            "<div class='alert alert-danger'>" +
                            "<strong>Game is over!</strong> You may try again." +
                            "</div>"
                        );
                    }
                } else if (checkedCell.bombsNear === 0) {
                    $(this).addClass("disabled");
                    checkedCell.isOpen = true;
                    let cellsAroundCoordinates = checkedCell.getClosedUnmarkedCellsAround();
                    cellsAroundCoordinates.forEach(coordinates => $("#btn_"+coordinates.x+"_"+coordinates.y).click());
                } else {
                    $(this).addClass("disabled");
                    $(this).text(checkedCell.bombsNear);
                    checkedCell.isOpen = true;
                }
            }
            if ($(this).hasClass('disabled')) {
                $(this).css('background', '#cccccc');
                $(this).css('border', '1px solid #999999');
                $(this).css('color', '#666666');
                $(this).css('outline', '0');
            }
            checkWin();
        });
    }

    function markFunction(x, y) {
        $("#btn_"+x+"_"+y).contextmenu(function(e) {
            e.preventDefault();
            let checkedCell = FIELD[y][x];
            if (!checkedCell.isMarked && !checkedCell.isOpen) {
                checkedCell.isMarked = true;
                $(this).text("b");
                $(this).attr("class", "isMarked");
                remainingMines--;
                $("#remainingMines").text(remainingMines);
            } else if (checkedCell.isMarked && !checkedCell.isOpen) {
                checkedCell.isMarked = false;
                $(this).text("");
                $(this).removeClass("isMarked");
                remainingMines++;
                $("#remainingMines").text(remainingMines);
            }
            checkWin();
        });
    }

    function middleClickFunction(x, y) {
        $("#btn_"+x+"_"+y).on( "mousedown", function( event ) {
            if (event.which === 2) {
                let checkedCell = FIELD[y][x];
                if (checkedCell.isOpen && checkedCell.bombsNear > 0) {
                    let markedBombsAround = checkedCell.getMarkedCellsAround().length;
                    let cellsAroundCoordinates = checkedCell.getClosedUnmarkedCellsAround();
                    if (checkedCell.bombsNear === markedBombsAround) {
                        cellsAroundCoordinates.forEach(coordinates => $("#btn_"+coordinates.x+"_"+coordinates.y).click());
                    } else {
                        cellsAroundCoordinates.forEach(coordinates => {
                            setTimeout(function(){
                                $("#btn_"+coordinates.x+"_"+coordinates.y).removeAttr('disabled');
                                }, 120);
                            $("#btn_"+coordinates.x+"_"+coordinates.y).attr('disabled', 'disabled');
                        });
                    }
                }
            }
        });
    }

    function checkWin() {
        let isWin = true;
        FIELD.forEach(rowsOfCells => rowsOfCells.forEach(cell => {
            if ((cell.hasBomb && !cell.isMarked) || (!cell.hasBomb && !cell.isOpen)) {
                isWin = false;
            }
        }));
        if (isWin) {
            $("#main").append(
                "<div class='alert alert-success'>" +
                "<strong>Congratulations!</strong> You are winner!" +
                "</div>"
            );
            gameFinished = true;
            clearInterval(timer);
        }
        return isWin;
    }
}