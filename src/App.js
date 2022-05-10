import { Fragment, useEffect, useState } from 'react';
import './App.css';
import Symbol from './symbol';

const symbols = {
  1: 'Spring',
  2: 'Extension',
  3: 'Balance',
  4: 'Bodyshape',
  5: 'Flexion',
  6: 'Travelling',
  7: 'Rotation',
  8: 'Fall',
  9: 'Stillness'
};

function App() {
  const [startScore, setStartScore] = useState(false);
  const [endScore, setEndScore] = useState(false);
  const [endSymbolPosition, setEndSymbolPosition] = useState(null);
  const [scoreSymbols, setScoreSymbols] = useState([]);

  useEffect(() => {
    if (scoreSymbols.length === 20) {
      setEndScore(true);
    }
  }, [scoreSymbols]);

  const startScoreHandler = () => setStartScore(true);

  const finishScoreHandler = () => {
    setEndSymbolPosition(` pos-${scoreSymbols.length}`);
    setEndScore(true);
  };

  const addSymbol = e => {
    if(!startScore || endScore) {
      return;
    }

    const name = e.currentTarget.querySelector('.btn-name').textContent;

    const targetSymbol = {id: Date.now(), name: name, char: e.currentTarget.querySelector(`.${name}`).textContent};
    setScoreSymbols(currentSymbols => [...currentSymbols, targetSymbol]);    
  };

  return (
    <div className="App">
      <header className="App-header">
          <h1>Language Of Dance Score Creator</h1>
      </header>
      <main>
        <section className="app-controls">
          <h2>Symbols</h2>
          <div className="symbol-choice-container">
            {Object.entries(symbols).map(([char, symbol]) => <figure className="symbol-btn" key={symbol} onClick={addSymbol}>
                                    <Symbol class='btn-char-symbol' name={symbol} character={char} />
                                    <figcaption className='btn-name'>{symbol}</figcaption>
                                  </figure>)}
          </div>
          <div className="buttons">
              <button onClick={startScoreHandler}>Start</button>
              <button onClick={finishScoreHandler}>Finish</button>
              <button disabled>Save PDF</button>
            </div>
        </section>
        <div className="score">
          {/* {startScore === true && <img className="start-symbol" src="../images/end_symbols/end.png" alt="start" height="20" width="120" />} */}
          {startScore === true && <Symbol class="start-symbol" character="=" />}
          {scoreSymbols.map((symbol, index) => {
              let topContinue;
              let bottomContinue;

              switch (index) {
                case 4:
                case 9:
                case 14:
                  topContinue = <img className={`continue-symbol continue-top continue-${index}`} src="https://daveknights.github.io/lod-score-creator/images/end_symbols/continue.png" alt="continue" height="20" width="120" />
                  break;
                case 5:
                case 10:
                case 15:
                  bottomContinue = <img className={`continue-symbol continue-btm continue-${index}`} src="https://daveknights.github.io/lod-score-creator/images/end_symbols/continue.png" alt="continue" height="20" width="120" />
                  break;
                default:
                  topContinue = null;
                  bottomContinue = null;
                  break;
              }

              return <Fragment key={symbol.id}>
                      {bottomContinue}
                      <Symbol class={`pos-${index} score-symbol`} name={symbol.name} options={true} character={symbol.char} />
                      {topContinue}
                    </Fragment>;
            })            
          }
          {/* {endScore === true && <img className={`end-symbol${endSymbolPosition}`} src="../images/end_symbols/end.png" alt="end" height="20" width="120" />} */}
          {endScore === true && <Symbol class={`end-symbol${endSymbolPosition}`} character="=" />}
        </div>
      </main>
    </div>
  );
}

export default App;
