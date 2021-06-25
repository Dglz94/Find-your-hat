const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const clear = require("clear-screen");
let juegoActivo = true;
let juegoGanado = false;
class Field {
  constructor() {
    this._fields = [];
    this._index = 0;
    this._subIndex = 0;
    this._x = 0;
    this._y = 0;
  }
  get fields() {
    return this._fields;
  }
  get index() {
    return this._index;
  }
  get subIndex() {
    return this._subIndex;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  play() {
    let h = prompt("Tell me the height ");
    let w = prompt("Tell me the width ");
    let p = prompt("Tell me the percentage of holes in the game ");

    this.generateField(h , w , p);
    let start = this.getIndex(fieldCharacter);
    this._index = start[0];
    this._subIndex = start[1];
    this._fields[start[0]][start[1]] = pathCharacter;
    while (juegoActivo) {
      this.print();
      let input = prompt("Which way?");
      if (this.validateInput(input)) {
        if (this.move(input)) {
            clear();
        } else {
            if(!juegoGanado){
                console.log("You lose");
            }
          return;
        }
      }
    }
    
  }
  print() {
    console.log(this.fields.join("\n"));
  }
  getIndex(character) {
    let arrayValidation = this.fields.map((field) =>
      field.includes(character)
    );
    let index = arrayValidation.indexOf(true);
    let subIndex = this.fields[index].indexOf(character);
    const res = [index, subIndex];
    return res;
  }
  validateInput(input) {
    if (input != "r" && input != "d" && input != "u" && input != "l") {
      console.log("Please enter a valid direction");
      return false;
    } else {
      return true;
    }
  }
  move(input) {
    switch (input) {
      case "r":
        this._subIndex = this.subIndex + 1;
        return this.validateMove();

      case "l":
        this._subIndex = this.subIndex - 1;
        return this.validateMove();

      case "u":
        this._index = this.index - 1;
        return this.validateMove();

      default:
        this._index = this.index + 1;
        return this.validateMove();
    }
  }
  validateMove() {
     
    if (this.index < 0 || this.subIndex < 0 || this.index > this.fields.length - 1|| this.subIndex > this.fields[this.index].length - 1) {
      console.log("Out of bonds");
      juegoActivo = false;
      return false;
    } else if (this.fields[this.index][this.subIndex] === hole) {
      console.log("You felll down a hole");
      juegoActivo = false;
      return false;
    } else if (this.fields[this.index][this.subIndex] === hat) {
      console.log("Winner Winner! Chicken dinner");
      juegoActivo = false;
      juegoGanado = true;
      return false;
    } else {
      this._fields[this.index][this.subIndex] = pathCharacter;
      return true;
    }
  }
  generateField(height, width, percentage) {
    percentage = Math.round((height * width) * .1)
    if(percentage >= Math.round(((height * width) / 2))){
        console.log('The percentage must be smaller than 50%');
        return;
    }
    for (let i = 0; i < height; i++) {
      this._fields.push([]);
      for (let j = 0; j < width; j++) {
        this._fields[i].push(fieldCharacter);
      }
    }
    console.log(percentage);
    for (let h = 0; h < percentage; h++) {
      const rndHeigth = this.randomNumbers(height);
      const rndWidth = this.randomNumbers(width);
      if(this.fields[rndHeigth][rndWidth] === hole){
        let indexRnd = this.getIndex(fieldCharacter);
        this._fields[indexRnd[0]][indexRnd[1]] = hole;
      }else{
        this._fields[rndHeigth][rndWidth] = hole;
      }
    }
    const rndHeigth = this.randomNumbers(height);
    const rndWidth = this.randomNumbers(width);
    if (this.fields[rndHeigth][rndWidth] === fieldCharacter) {
      this._fields[rndHeigth][rndWidth] = hat;
    } else if(this.fields[rndHeigth][rndWidth] === hole){
        let indexHat = this.getIndex(fieldCharacter);
        this._fields[indexHat[0]][indexHat[1]] = hat;
    }
  }
  randomNumbers(number) {
    return Math.floor(Math.random() * (number - 1));
  }
}

const myField = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["░", "^", "░"],
]);

myField.play();
