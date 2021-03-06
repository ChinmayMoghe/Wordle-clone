"use strict";
const DEFAULT_WORD_LENGTH = 5;
const DEFAULT_TRY_COUNT = 6;
import { WORD_LIST } from "./words.js";
class Wordle {
  constructor(wordLength = DEFAULT_WORD_LENGTH, tries = DEFAULT_TRY_COUNT) {
    this.wordLength = wordLength;
    this.tries = tries;
    this.gridElement = document.querySelector(".wordle_grid");
    this.keyBoardElement = document.querySelector(".keyboard");
    this.initializeGameState();
    this.addKeyboardEventListener();
  }

  initializeGameState = () => {
    this.gridElement.innerHTML = "";
    this.keyBoardElement.innerHTML = "";
    this.word = getRandomWord(WORD_LIST);
    this.currentWord = "";
    this.currentLetterIdx = 0;
    this.currentTry = 0;
    this.allWords = [];
    this.won = false;
    this.updateCurrentIdxRange();
    this.createKeyboard();
    this.createWordleGrid();
  };

  domLetterIdx = () => this.currentLetterIdx + 1;

  addKeyboardEventListener = () => {
    document.addEventListener("keydown", this.handleKeyPress);
  };

  createWordleGrid() {
    /*create wordle grid and add to DOM*/
    document.documentElement.style.setProperty("--wordle-tries", this.tries);
    document.documentElement.style.setProperty(
      "--wordle-word-length",
      this.wordLength
    );
    let letterCount = this.tries * this.wordLength;
    while (letterCount) {
      const letterElement = document.createElement("div");
      letterElement.classList.add("letter");
      this.gridElement.append(letterElement);
      letterCount--;
    }
  }

  createKeyboard() {
    /*create keyboard and add it to DOM*/
    const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    for (let row of KEYBOARD_ROWS) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("keyboard_row");
      const keys = row.split("").map((letter) => {
        const letterElem = document.createElement("div");
        letterElem.textContent = letter.toUpperCase();
        letterElem.dataset.key = letter;
        letterElem.classList.add("key");
        return letterElem;
      });
      rowElement.append(...keys);
      if (KEYBOARD_ROWS.indexOf(row) === KEYBOARD_ROWS.length - 1) {
        const enterKey = document.createElement("div");
        enterKey.classList.add("key", "action-key");
        const backSpaceKey = enterKey.cloneNode(true);
        enterKey.textContent = "Enter";
        enterKey.dataset.key = "Enter";
        backSpaceKey.innerHTML = "&larr;";
        backSpaceKey.dataset.key = "Backspace";
        rowElement.prepend(enterKey);
        rowElement.append(backSpaceKey);
      }
      this.keyBoardElement.append(rowElement);
      this.keyBoardElement.addEventListener("click", this.handleClickKeyPress);
    }
  }

  addLetterToCurrentWord(letter) {
    if (this.currentLetterIdx < this.wordEndIdx) {
      const letterElem = document.querySelector(
        `.letter:nth-of-type(${this.domLetterIdx()})`
      );
      if (!letterElem) return;
      letterElem.textContent = letter;
      this.currentWord += letter;
      this.currentLetterIdx++;
    }
  }

  handleKeyPress = (event) => {
    /* handle keypress for keyboard*/
    const ACTION_KEYS = ["Enter", "Backspace"];
    const KEYS = "qwertyuiopasdfghjklzxcvbnm";
    const eventKey = event.key.toLowerCase();
    if (!KEYS.includes(eventKey) && ACTION_KEYS.indexOf(event.key) < 0) return;
    if (KEYS.includes(eventKey)) this.addLetterToCurrentWord(eventKey);
    const action_key_idx = ACTION_KEYS.indexOf(event.key);
    if (action_key_idx === 0) this.handleEnterKey();
    if (action_key_idx === 1) this.handleBackSpaceKey();
  };

  handleClickKeyPress = (event) => {
    /*handle click keypress for keyboard*/
    if (!event.target.classList.contains("key")) return;
    if (!event.target.classList.contains("action-key")) {
      this.addLetterToCurrentWord(event.target.dataset.key);
    }
    if (event.target.dataset.key === "Enter") this.handleEnterKey();
    if (event.target.dataset.key === "Backspace") this.handleBackSpaceKey();
  };

  removeLetterFromCurrentWord() {
    if (
      this.currentLetterIdx >= this.wordStartIdx &&
      this.currentLetterIdx <= this.wordEndIdx
    ) {
      const letterElem = document.querySelector(
        `.letter:nth-of-type(${this.currentLetterIdx})`
      );
      if (!letterElem) return;
      letterElem.textContent = null;
      this.currentWord = this.currentWord.slice(0, -1);
      this.currentLetterIdx--;
    }
  }

  showToast = (message, seconds = 1, showRestartBtn = false) => {
    const toastElem = document.querySelector(".toast");
    toastElem.textContent = message;
    if (showRestartBtn) {
      const btn = document.createElement("button");
      btn.classList.add("play-again");
      btn.textContent = "Play again";
      btn.addEventListener("click", () => {
        this.initializeGameState();
        toastElem.classList.remove("visible");
        toastElem.textContent = "";
      });
      toastElem.append(btn);
    }
    toastElem.classList.add("visible");
    return new Promise((res, rej) =>
      setTimeout(() => {
        toastElem.classList.remove("visible");
        toastElem.textContent = "";
        res();
      }, seconds * 1000)
    );
  };

  checkWord = () => {
    if (WORD_LIST.includes(this.currentWord)) {
      if (this.currentWord === this.word) {
        for (let i = this.wordStartIdx; i <= this.wordEndIdx; i++) {
          document
            .querySelector(`.letter:nth-of-type(${i})`)
            .classList.add("right-position");
        }
        this.won = true;
        this.showToast("YOU WIN", 20).then(() =>
          this.showToast("Play again ?", 50, true)
        );
      } else {
        for (let idx = 0; idx < this.currentWord.length; idx++) {
          const letter = this.currentWord[idx];
          const letterElem = document.querySelector(
            `.letter:nth-of-type(${this.wordStartIdx + idx})`
          );
          if (this.word.includes(letter)) {
            if (this.word.indexOf(letter) === idx) {
              letterElem.classList.add("right-position");
            } else {
              letterElem.classList.add("wrong-position");
            }
          } else {
            letterElem.classList.add("wrong-letter");
          }
        }
      }
      return true;
    } else {
      for (let i = this.wordStartIdx; i <= this.wordEndIdx; i++) {
        document
          .querySelector(`.letter:nth-of-type(${i})`)
          .classList.add("no_word");
      }
      setTimeout(() => {
        for (let i = this.wordStartIdx; i <= this.wordEndIdx; i++) {
          document
            .querySelector(`.letter:nth-of-type(${i})`)
            .classList.remove("no_word");
        }
      }, 400);
      this.showToast("This word is not in the list", 1.5);
      return false;
    }
  };

  handleEnterKey() {
    /*handle Enter key press*/
    /*check the current length of word*/
    /*if 5 letter word - increment nextLetterIdx, currentTry*/
    if (this.currentWord.length === this.wordLength) {
      const isvalidWord = this.checkWord();
      if (isvalidWord) {
        this.currentTry += 1;
        this.updateCurrentIdxRange();
        this.allWords.push(this.currentWord);
        this.currentWord = "";
        if (this.currentTry === this.tries && !this.won) {
          this.showToast(
            `Better luck next time,  word is : ${this.word}`,
            3
          ).then(() => this.showToast("Play again ?", 50, true));
        }
      }
    }
  }

  updateCurrentIdxRange() {
    this.wordStartIdx = this.wordLength * this.currentTry + 1;
    this.wordEndIdx =
      this.wordLength * this.currentTry + this.wordLength - 1 + 1;
  }

  handleBackSpaceKey() {
    /*handle backspace key press*/
    this.removeLetterFromCurrentWord();
  }
}

const getRandomWord = (arr) => {
  return arr[Math.ceil(Math.random() * Math.ceil((arr.length - 1) / 2))];
};

const initApp = () => {
  const wordle = new Wordle();
};

document.addEventListener("DOMContentLoaded", initApp);
