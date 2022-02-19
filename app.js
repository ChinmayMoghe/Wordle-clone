"use strict";
const DEFAULT_WORD_LENGTH = 5;
const DEFAULT_TRY_COUNT = 6; 

class Wordle {
    constructor(wordLength=DEFAULT_WORD_LENGTH,tries=DEFAULT_TRY_COUNT) {
        this.wordLength = wordLength;
        this.tries = tries;
        this.gridElement = document.querySelector('.wordle_grid');
        this.keyBoard = document.querySelector('.keyboard');
        this.currentWord ='';
        this.allWords = [];
        this.currentCount = 0;
        this.currentTry = 1; 
    }

    createWordleGrid() {
        /*create wordle grid and add to DOM*/
    }
    
    createKeyboard() {
        /*create keyboard and add it to DOM*/
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
}

document.addEventListener("DOMContentLoaded",initApp);
