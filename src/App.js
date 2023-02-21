import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';
import Symbol from './Symbol';
import Message from './Message';
import chevron from './images/chevron-icon.svg';
import NamePDF from './NamePDF';

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
  const [endScore, setEndScore] = useState(false);
  const [endSymbolPosition, setEndSymbolPosition] = useState(null);
  const [scoreSymbols, setScoreSymbols] = useState({});
  const [swapKey, setSwapKey] = useState(null);
  const [message, setMessage] = useState('');
  const [showNamingForm, setShowNamingForm] = useState(false);
  const [scoreName, setScoreName] = useState('');
  const score = useRef(null);
  const symbolChoiceContainer = useRef(null);

  const finishScoreHandler = useCallback(() => {
    setEndSymbolPosition(` pos-${Object.keys(scoreSymbols).length}`);
    setEndScore(true);
    setShowNamingForm(true);
  }, [scoreSymbols]);

  useEffect(() => {
    if (Object.keys(scoreSymbols).length === 32) {
      finishScoreHandler();
    }
  }, [scoreSymbols, finishScoreHandler]);

  const addSymbol = e => {
    if(endScore) {
      return;
    }

    const name = e.currentTarget.querySelector('.btn-name').textContent;
    const char = e.currentTarget.querySelector(`.${name}`).textContent;
    let key;

    if(swapKey) {
      key = swapKey
      setSwapKey(null);
      setMessage('');
    } else {
      key = [`${name.toLowerCase()}-pos-${Object.keys(scoreSymbols).length}`];
    }

      setScoreSymbols(currentSymbols => ({...currentSymbols,
        [key]: {
          name: name,
          char: char
        }
      }));
  };

  const handleSwapSymbol =  e => {
    setMessage('Choose a new symbol');
    setSwapKey(e.target.parentNode.parentNode.id);
  };

  const handleRemoveSymbol = e => {
    const symbolToRemove = e.target.parentNode.parentNode.id;

    setScoreSymbols(currentSymbols => {
      const updatedScoreSymbol = {...currentSymbols};

      delete updatedScoreSymbol[symbolToRemove];

      return updatedScoreSymbol;
    });
  };

  const handleClickSavePDF = () => finishScoreHandler();

  const handleClearScore = () => {
    setScoreSymbols([]);
    setEndSymbolPosition(null);
    setEndScore(false);
  };

  const handleCancel = () => {
    setMessage('');
    setSwapKey(null);
  }

  const handleToggleSymbolNames = () => symbolChoiceContainer.current.classList.toggle('open');

  const handleSetScoreName = e => setScoreName(e.target.value);

  const handleSaveScore = async e => {
      e.preventDefault();
      setShowNamingForm(false);

      const canvas = await html2canvas(score.current);
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      const pdfName = scoreName.trim().toLowerCase().replace(/\s+/g, '-').replace('.', '') || 'lod-score';

      pdf.addImage(data, 'PNG', 0, 8, pdfWidth, pdfHeight);
      pdf.save(`${pdfName}.pdf`);
  };

  const handleCloseNamingForm = () => setShowNamingForm(false);

  return (
    <div className="App">
      <header className="App-header">
          <h1>LOD Score creator</h1>
      </header>
      <main className="flex">
        <section className="app-controls">
          <div ref={symbolChoiceContainer} className="symbol-choice-container">
            <button className="symbol-name-toggle" onClick={handleToggleSymbolNames}>
              <img src={chevron} alt="<" className="chevron" height="18" width="10" />
            </button>
            {Object.entries(symbols).map(([char, symbol]) => <figure className="symbol-btn flex-mob" key={symbol} onClick={addSymbol}>
                                    <Symbol class='btn-char-symbol' name={symbol} character={char} />
                                    <figcaption className='btn-name'>{symbol}</figcaption>
                                  </figure>)}
          </div>
          <div className="buttons flex">
              <button className="save-pdf btn primary-btn" onClick={handleClickSavePDF} {... !Object.keys(scoreSymbols).length && {disabled: 'disabled'}}>Save PDF</button>
              <button className="clear-btn btn" onClick={handleClearScore} {... !Object.keys(scoreSymbols).length && {disabled: 'disabled'}}>Clear</button>
            </div>
        </section>
        <div className="score">
          <div className="pdf-container flex" ref={score}>
              <span className="start-symbol flex"></span>
              {Object.entries(scoreSymbols).map(([key,symbol], index) => {
                let topContinue;
                let bottomContinue;

                switch (index) {
                  case 8:
                  case 16:
                  case 24:
                    topContinue = <span className={`continue-symbol flex flex-center continue-top continue-${index}`}></span>
                    bottomContinue = <span className={`continue-symbol flex flex-center continue-btm continue-${index+1}`}></span>
                    break;
                  default:
                    topContinue = null;
                    bottomContinue = null;
                    break;
                }

                return  <Fragment key={key}>
                          {bottomContinue}
                          <Symbol
                            id={key}
                            class={`score-symbol pos-${index}`}
                            name={symbol.name}
                            options={true}
                            character={symbol.char}
                            handleSwapSymbol={handleSwapSymbol}
                            handleRemoveSymbol={handleRemoveSymbol} />
                          {topContinue}
                        </Fragment>;
              })
            }
            {endScore === true && <span className={`flex column end-symbol${endSymbolPosition}`}></span>}
            {message && <Message message={message} handleCancel={handleCancel} />}
          </div>
          {showNamingForm && <NamePDF
                          handleSetScoreName={handleSetScoreName}
                          handleSaveScore={handleSaveScore}
                          scoreName={scoreName}
                          handleCloseNamingForm={handleCloseNamingForm} />}
        </div>
      </main>
    </div>
  );
}

export default App;
