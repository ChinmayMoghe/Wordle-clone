"use strict";
const DEFAULT_WORD_LENGTH = 5;
const DEFAULT_TRY_COUNT = 6; 

class Wordle {
    constructor(wordLength=DEFAULT_WORD_LENGTH,tries=DEFAULT_TRY_COUNT) {
        this.wordLength = wordLength;
        this.tries = tries;
        this.gridElement = document.querySelector('.wordle_grid');
        this.keyBoardElement = document.querySelector('.keyboard');
        this.currentWord ='';
        this.allWords = [];
        this.currentCount = 0;
        this.currentTry = 1; 
    }

    createWordleGrid() {
        /*create wordle grid and add to DOM*/
        document.documentElement.style.setProperty('--wordle-tries',this.tries);
        document.documentElement.style.setProperty('--wordle-word-length',this.wordLength);
        let letterCount = this.tries*this.wordLength;
        while(letterCount) {
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter');
            this.gridElement.append(letterElement);
            letterCount--;
        }
    }
    
    createKeyboard() {
        /*create keyboard and add it to DOM*/
        const KEYBOARD_ROWS = ['qwertyuiop','asdfghjkl','zxcvbnm'];
        for(let row of KEYBOARD_ROWS) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('keyboard_row');
            const keys = row.split('').map(letter=>{
                const letterElem = document.createElement('button');
                letterElem.textContent = letter.toUpperCase();
                letterElem.classList.add('key');
                return letterElem;
            });
            rowElement.append(...keys);
            if(KEYBOARD_ROWS.indexOf(row) === KEYBOARD_ROWS.length - 1) {
                const enterKey = document.createElement('button');
                enterKey.classList.add('key','action-key');
                const backSpaceKey = enterKey.cloneNode(true);
                enterKey.textContent="Enter";
                backSpaceKey.innerHTML = '&larr;';
                rowElement.prepend(enterKey);
                rowElement.append(backSpaceKey);
            }
            this.keyBoardElement.append(rowElement);
        }

    }
    
    handleKeyPress() {
        /* handle keypress for keyboard*/
    }

    handleClickKeyPress() {
        /*handle click keypress for keyboard*/
    }
    
    handleEnterKey() {
        /*handle Enter key press*/
    }

    handleBackSpaceKey() {
        /*handle backspace key press*/
    }
}

const initApp = () => {
    const wordle = new Wordle();
    wordle.createWordleGrid();
    wordle.createKeyboard();
}

document.addEventListener("DOMContentLoaded",initApp);
