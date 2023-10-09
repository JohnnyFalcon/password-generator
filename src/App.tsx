import {
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction
} from "react";
import "./App.scss";
import { symbolsArr } from "./symbols";

import IconCopy from "./assets/images/IconCopy.svg?react";
import IconArrow from "./assets/images/icon-arrow-right.svg?react";
function App() {
  // -------------- Types ------------------

  type CheckboxTypes = {
    name: string;
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    array: string[];
  };
  type LevelType = {
    name: string;
    class: string;
  };
  // ------------- States ----------------------
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [lowercase, setLowercase] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [symbols, setSymbols] = useState<boolean>(false);
  const [ArrayOfChar, setArrayOfChar] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [checkboxPoints, setcheckboxPoints] = useState<number>(0);
  const [rangePoints, setRangePoints] = useState<number>(0);
  const [passwordLength, setPasswordLength] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);
  const [rangeStyle, setRangeStyle] = useState({});
  const [levelAtr, setlevelAtr] = useState<LevelType>({ name: "", class: "" });
  // Arrays of characters from Ascii
  const StrengthPoints = checkboxPoints + rangePoints;
  const lowercaseLetters: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode("a".charCodeAt(0) + i)
  );

  const uppercaseLetters: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  );

  const numbersArr: string[] = Array.from({ length: 10 }, (_, i) =>
    i.toString()
  );

  //  Array for checkbox inputs to map through

  const checkboxNames: CheckboxTypes[] = [
    {
      name: "Include Uppercase Letters",
      state: uppercase,
      setState: setUppercase,
      array: uppercaseLetters
    },
    {
      name: "Include Lowercase Letters",
      state: lowercase,
      setState: setLowercase,
      array: lowercaseLetters
    },
    {
      name: "Include Numbers",
      state: numbers,
      setState: setNumbers,
      array: numbersArr
    },
    {
      name: "Include Symbols",
      state: symbols,
      setState: setSymbols,
      array: symbolsArr
    }
  ];
  // --------------- Functions ----------------------

  const handleCheckbox = (
    characterToggle: boolean,
    characterArr: string[],
    setCharacterToggle: (char: boolean) => void
  ) => {
    if (characterToggle) {
      // Removing array of included characters when user  unchecked checkbox
      const filteredArray = ArrayOfChar.filter(
        (item) => !characterArr.includes(item)
      );

      setArrayOfChar([...filteredArray]);
      setcheckboxPoints(checkboxPoints - 2);
      setCharacterToggle(false);
    } else {
      // Adding array of new characters
      setArrayOfChar((prevArr) => [...prevArr, ...characterArr]);
      // Each checkbox gives additional  points to determine final password strength
      setcheckboxPoints(checkboxPoints + 2);
      setCharacterToggle(true);
    }
  };
  // First four characters are always one of the included so function mix array to make sure they're on random position
  const shuffle = (array: string[]) => {
    //Fisher-Yates Sorting Algorithm - complexity 0(n)
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const GeneratePassword = (length: number) => {
    const PasswordArray: string[] = Array.from(
      { length: length },
      (_, index) => {
        // Ensuring that, random included characters appear at least once
        for (let i = 0; i < 4; i++) {
          const names = checkboxNames[i];
          if (index === i && names.state) {
            let randomNumber: number = Math.floor(
              Math.random() * names.array.length
            );
            return names.array[randomNumber];
          }
        }
        let randomNumber: number = Math.floor(
          Math.random() * ArrayOfChar.length
        );
        return ArrayOfChar[randomNumber];
      }
    );
    const shuffleArray: string[] = shuffle(PasswordArray);

    setPassword(shuffleArray.join(""));
  };

  const handleRange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordLength(Number(e.currentTarget.value));

    const length = Number(e.currentTarget.value);
    // Length increase strength point by 0.4 to determine final password strength
    setRangePoints(length * 0.8);
    // Script for custom Range input
    const progress = (length / 20) * 100;
    const sliderStyle = {
      background: `linear-gradient(to right, #a4ffaf ${progress}%, #18171F ${progress}%)`
    };
    setRangeStyle(sliderStyle);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Displaying strength level only when password is generated
    if (ArrayOfChar.length !== 0 && passwordLength !== 0) {
      strengthLevel(StrengthPoints);
    }
    // When user unchecked all checkboxes or set character length to 0 hide strength level
    if (passwordLength === 0 || ArrayOfChar.length === 0) {
      setlevelAtr({ name: "", class: "" });
    }
    GeneratePassword(passwordLength);
  };

  const copyTextToClipboard = async (text: string) => {
    const textCopied = await navigator.clipboard.writeText(text);
    if (password) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
    return textCopied;
  };

  const strengthLevel = (points: number) => {
    if (points <= 6) {
      setlevelAtr({ name: "TOO WEAK!", class: "level-1" });
    } else if (points <= 12) {
      setlevelAtr({ name: "WEAK", class: "level-2" });
    } else if (points <= 18) {
      setlevelAtr({ name: "MEDIUM", class: "level-3" });
    } else {
      setlevelAtr({ name: "STRONG", class: "level-4" });
    }
  };

  return (
    <>
      <div className="container">
        <h1>Password Generator</h1>
        <div className="password-display">
          {password.length === 0 ? (
            <p className="password-none">P4$5W0rD!</p>
          ) : (
            <p className="password">{password}</p>
          )}
          <span
            className="icon-copy"
            onClick={() => copyTextToClipboard(password)}
          >
            {isCopied && <p>COPIED</p>} <IconCopy />
          </span>
        </div>
        <div className="settings">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="range-label">
                <p>Character Length</p>
                <span>{passwordLength}</span>
              </div>
              <input
                type="range"
                name="length"
                id="range"
                style={rangeStyle}
                min={0}
                max={20}
                step={1}
                value={passwordLength}
                onChange={handleRange}
              />
            </div>
            <ul className="checkboxes">
              {checkboxNames.map((checkbox, i) => (
                <li key={i}>
                  <label htmlFor={checkbox.name}>
                    <input
                      type="checkbox"
                      name={checkbox.name}
                      id={checkbox.name}
                      checked={checkbox.state}
                      readOnly
                    />
                    <span
                      className="checkmark"
                      onClick={() =>
                        handleCheckbox(
                          checkbox.state,
                          checkbox.array,
                          checkbox.setState
                        )
                      }
                    ></span>
                    {checkbox.name}
                  </label>
                </li>
              ))}
            </ul>
            <div className="strength-box">
              <p>STRENGTH</p>
              <div className={`level ${levelAtr.class}`}>
                <p>{levelAtr.name}</p>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <button type="submit" className="generate-button">
              <span>GENERATE</span> <IconArrow />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
