import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import './App.css';
import Symbol from './Symbol';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const App = () => {
  const [startScore, setStartScore] = useState(false);
  const [endScore, setEndScore] = useState(false);
  const [endSymbolPosition, setEndSymbolPosition] = useState(null);
  const [scoreSymbols, setScoreSymbols] = useState({});
  const score = useRef(null);

  useEffect(() => setStartScore(true), []);

  const finishScoreHandler = useCallback(() => {
    setEndSymbolPosition(` pos-${Object.keys(scoreSymbols).length}`);
    setEndScore(true);
  }, [scoreSymbols]);

  useEffect(() => {
    if (Object.keys(scoreSymbols).length === 20) {
      finishScoreHandler();
    }
  }, [scoreSymbols, finishScoreHandler]);

  const addSymbol = e => {
    if(endScore) {
      return;
    }

    const name = e.currentTarget.querySelector('.btn-name').textContent;
    const char = e.currentTarget.querySelector(`.${name}`).textContent;

    setScoreSymbols(currentSymbols => ({...currentSymbols, [`${name.toLowerCase()}-pos-${Object.keys(scoreSymbols).length}`]: {
      name: name,
      char: char
    }}));
  };

  const handleRemoveSymbol = e => {
    const symbolToRemove = e.target.parentNode.id;
    setScoreSymbols(currentSymbols => {
      const updatedScoreSymbol = {...currentSymbols};

      delete updatedScoreSymbol[symbolToRemove];

      return updatedScoreSymbol;
    })
  };

  const handleSaveToPdf = async () => {
    const canvas = await html2canvas(score.current);
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    finishScoreHandler();

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('lod_score.pdf');
  };

  const handleClearScore = () => {
    setScoreSymbols({});
    setEndSymbolPosition(null);
    setEndScore(false);
  };

  return (
    <div className="App">
      <header className="App-header">
          <h1>Language Of Dance Score Creator</h1>
      </header>
      <main>
        <section className="app-controls">
          <div className="symbol-choice-container">
            {Object.entries(symbols).map(([char, symbol]) => <figure className="symbol-btn" key={symbol} onClick={addSymbol}>
                                    <Symbol class='btn-char-symbol' name={symbol} character={char} />
                                    <figcaption className='btn-name'>{symbol}</figcaption>
                                  </figure>)}
          </div>
          <div className="buttons">
              <button onClick={handleSaveToPdf}>Save PDF</button>
              <button onClick={handleClearScore}>Clear</button>
            </div>
        </section>
        <div className="score">
          <div className="pdf-container" ref={score}>
            {startScore === true && <Symbol class="start-symbol" character="=" />}
            {Object.entries(scoreSymbols).map(([key, symbol], index) => {
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

                return <Fragment key={key}>
                        {bottomContinue}
                        <Symbol
                          id={key}
                          class={`score-symbol pos-${index}`}
                          name={symbol.name}
                          options={true}
                          character={symbol.char}
                          handleRemoveSymbol={handleRemoveSymbol} />
                        {topContinue}
                      </Fragment>;
              })
            }
            {endScore === true && <Symbol class={`end-symbol${endSymbolPosition}`} character="=" />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
