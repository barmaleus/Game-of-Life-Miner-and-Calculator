
function startGameOfLife() {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "field");
    canvas.setAttribute("width", "290");
    canvas.setAttribute("height", "290");
    document.body.appendChild(canvas);

    if (canvas.getContext) {

        let ctx = canvas.getContext('2d');

        const FIELD = new Array(30).fill(0).map(() => new Array(30).fill(0));

        class Animal {
            constructor(lifeValue, reproductionPeriod, color) {
                this.lifeValue = lifeValue;
                this.age=0;
                this.reproductionPeriod = reproductionPeriod;
                this.x = (Math.round((Math.random()*canvas.width)/10));
                this.y = (Math.round((Math.random()*canvas.height)/10));
                this.radius = 5;
                this.color = color;
                this.ctx = canvas.getContext('2d');
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

            draw() {
                this.ctx.beginPath();
                this.ctx.arc(this.x * 10, this.y * 10, this.radius, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
        }

        class Victim extends Animal {
            constructor(reproductionPeriod) {
                super(-1, reproductionPeriod, 'green');
            }

            static die(x, y) {
                FIELD[y][x] = 0;
                victims = victims.filter(function (el) {
                    return !(el.x === x && el.y === y);
                });
            }

            move() {
                let cellsAround = this.selectFreeCells();
                if (cellsAround.length > 0) {
                    if (this.age !== 0 && (this.age % this.reproductionPeriod === 0)) {
                        this.reproduce(cellsAround);
                    } else {
                        let cellIndex = Math.floor(Math.random() * cellsAround.length);
                        let x = cellsAround[cellIndex].x;
                        let y = cellsAround[cellIndex].y;
                        FIELD[this.y][this.x] = 0;
                        this.x = x;
                        this.y = y;
                        FIELD[y][x] = -1;
                    }
                }
                this.age++;
            }

            reproduce(cellsAround) {
                let newAnimal = new Victim(this.reproductionPeriod);
                let cellIndex = Math.floor(Math.random() * cellsAround.length);
                let x = cellsAround[cellIndex].x;
                let y = cellsAround[cellIndex].y;
                newAnimal.x = x;
                newAnimal.y = y;
                victims.push(newAnimal);
                FIELD[y][x] = -1;
            }

            selectFreeCells() {
                let cells = super.addCellsAround();
                cells = cells.filter(function (el) {
                    return FIELD[el.y][el.x] === 0;
                });
                return cells;
            }
        }

        class Predator extends Animal {
            constructor(reproductionPeriod) {
                super(1, reproductionPeriod, 'red');
                this.dieValue = 3;
            }

            die() {
                let x = this.x;
                let y = this.y;
                FIELD[y][x] = 0;
                predators = predators.filter(function (el) {
                    return !(el.x === x && el.y === y);
                });

            }

            move() {
                if (this.lifeValue === this.dieValue) {
                    this.die();
                } else {
                    let cellsAround = this.selectCellsAroundWithoutPredators();
                    if (cellsAround.length > 0) {
                        if (this.age !== 0 && (this.age % this.reproductionPeriod === 0)) {
                            this.reproduce(cellsAround);
                        } else {
                            this.lifeValue++;
                            let cellIndex = Math.floor(Math.random() * cellsAround.length);
                            let x = cellsAround[cellIndex].x;
                            let y = cellsAround[cellIndex].y;
                            if (this.checkCellForVictim(x, y)) {
                                Victim.die(x, y);
                                this.lifeValue = 1;
                            }
                            FIELD[this.y][this.x] = 0;
                            this.x = x;
                            this.y = y;
                            FIELD[this.y][this.x] = this.lifeValue;
                        }
                    }
                    this.age++;
                }
            }

            reproduce(cellsAround) {
                this.lifeValue++;
                let newAnimal = new Predator(this.reproductionPeriod);
                let cellIndex = Math.floor(Math.random() * cellsAround.length);
                let x = cellsAround[cellIndex].x;
                let y = cellsAround[cellIndex].y;
                if (this.checkCellForVictim(x, y)) {
                    Victim.die(x, y);
                    this.lifeValue = 1;
                }
                newAnimal.x = x;
                newAnimal.y = y;
                predators.push(newAnimal);
                FIELD[y][x] = newAnimal.lifeValue;
            }

            selectCellsAroundWithoutPredators() {
                let cells = super.addCellsAround();
                cells = cells.filter(function (el) {
                    return FIELD[el.y][el.x] <= 0;
                });
                return cells;
            }

            //it checks concrete cell for herbivore presence, if presents returns true
            checkCellForVictim(x, y) {
                return FIELD[y][x] === -1;
            }
        }

        let victims = [];
        for(let i=0; i<225; i++) {
            victims[i] = new Victim(3);
            while (FIELD[victims[i].y][victims[i].x] !== 0) {
                victims[i] = new Victim(3);
            }
            FIELD[victims[i].y][victims[i].x] = victims[i].lifeValue;
        }

        let predators = [];
        for(let i=0; i<225; i++) {
            predators[i] = new Predator(4);
            while (FIELD[predators[i].y][predators[i].x] !== 0) {
                predators[i] = new Predator(4);
            }
            FIELD[predators[i].y][predators[i].x] = predators[i].lifeValue;
        }

        function drawObjsOnField() {
            ctx.clearRect(0,0, canvas.width, canvas.height);

            predators.forEach(function(c) {
                c.draw();
            });

            victims.forEach(function(h) {
                h.draw();
            });

            window.requestAnimationFrame(drawObjsOnField);
        }
        window.requestAnimationFrame(drawObjsOnField);

        let i = setInterval(moveAll, 200);
        setTimeout(function( ) { clearInterval( i ); }, 30000);

        function moveAll() {
            predators.forEach(el => el.move());
            victims.forEach(el => el.move());
            drawObjsOnField();
            if (predators.length === 0 && victims.length === 0) {
                clearInterval(i);
            }
        }

    }
}