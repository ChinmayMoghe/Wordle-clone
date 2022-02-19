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
        this.currentLetterIndex = 0;
        this.allWords = [];
        this.currentWordLetterCount = 0;
        this.currentTry = 0;
        this.addKeyboardEventListener(); 
    }

    addKeyboardEventListener = () => {
        document.addEventListener('keydown',this.handleKeyPress);
    };

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
                const letterElem = document.createElement('div');
                letterElem.textContent = letter.toUpperCase();
                letterElem.dataset.key = letter;
                letterElem.classList.add('key');
                return letterElem;
            });
            rowElement.append(...keys);
            if(KEYBOARD_ROWS.indexOf(row) === KEYBOARD_ROWS.length - 1) {
                const enterKey = document.createElement('div');
                enterKey.classList.add('key','action-key');
                const backSpaceKey = enterKey.cloneNode(true);
                enterKey.textContent="Enter";
                enterKey.dataset.key = "Enter";
                backSpaceKey.innerHTML = '&larr;';
                backSpaceKey.dataset.key = 'Backspace';
                rowElement.prepend(enterKey);
                rowElement.append(backSpaceKey);
            }
            this.keyBoardElement.append(rowElement);
            this.keyBoardElement.addEventListener('click',this.handleClickKeyPress);
        }

    }

    addLetterToCurrentWord(letter) {
        const letterElem = document.querySelector(`.letter:nth-of-type(${this.currentLetterIndex + 1})`);
        if(!letterElem) return;
        letterElem.textContent = letter;
        this.currentWord+=letter;
        this.currentLetterIndex++;
        this.currentWordLetterCount++;
    }
    
    handleKeyPress = (event) => {
        /* handle keypress for keyboard*/
        const ACTION_KEYS = ['Enter','Backspace'];
        const KEYS = 'qwertyuiopasdfghjklzxcvbnm';
        const eventKey = event.key.toLowerCase();
        if(!KEYS.includes(eventKey) && ACTION_KEYS.indexOf(event.key) < 0) return;
        if(KEYS.includes(eventKey)) this.addLetterToCurrentWord(eventKey);
        const action_key_idx = ACTION_KEYS.indexOf(event.key);
        if(action_key_idx === 0) this.handleEnterKey();
        if(action_key_idx === 1) this.handleBackSpaceKey();
    }

    handleClickKeyPress = (event) => {
        /*handle click keypress for keyboard*/
        if(!event.target.classList.contains('key')) return;
        if(!event.target.classList.contains('action-key')) {
            this.addLetterToCurrentWord(event.target.dataset.key);
        };
    }


    removeLetterFromCurrentWord() {
        const letterElem = document.querySelector(`.letter:nth-of-type(${this.currentLetterIndex})`);
        if(!letterElem) return;
        letterElem.textContent = null;
        this.currentWord = this.currentWord.slice(0,-1);
        this.currentLetterIndex--;
        this.currentWordLetterCount--;
    }
    
    handleEnterKey() {
        /*handle Enter key press*/
        console.log('hit enter');
    }

    handleBackSpaceKey() {
        /*handle backspace key press*/
        this.removeLetterFromCurrentWord();
    }
}

const initApp = () => {
    const wordle = new Wordle();
    wordle.createWordleGrid();
    wordle.createKeyboard();
}

document.addEventListener("DOMContentLoaded",initApp);
