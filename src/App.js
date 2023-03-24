import { Fragment, useCallback, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';
import Symbol from './Symbol';
import Message from './Message';
import Pagination from './Pagination';
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
// let pageSymbolCount;

const App = () => {
  const [endScore, setEndScore] = useState(false);
  const [endSymbolPosition, setEndSymbolPosition] = useState(null);
  const [scoreSymbols, setScoreSymbols] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSymbolCount, setPageSymbolCount] = useState(0);
  const [swapKey, setSwapKey] = useState(null);
  const [message, setMessage] = useState('');
  const [showNamingForm, setShowNamingForm] = useState(false);
  const [scoreName, setScoreName] = useState('');
  const score = useRef(null);
  const symbolChoiceContainer = useRef(null);

  const finishScoreHandler = useCallback(() => {
    setEndSymbolPosition(` pos-${pageSymbolCount}`);
    setEndScore(true);
    setShowNamingForm(true);
  }, [pageSymbolCount]);

  const addSymbol = e => {
    if(!swapKey && pageSymbolCount === 32) {
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
      key = [`${name.toLowerCase()}-pos-${Object.keys(scoreSymbols).length}-${pageNum}`];
    }

    setScoreSymbols(currentSymbols => ({
      ...currentSymbols,
      [key]: {
        name: name,
        char: char
      }
    }));
  };

  const handleSwapSymbol =  e => {
    setMessage('Choose a new symbol');
    setSwapKey(e.target.parentNode.parentNode.id);
    endScore && setEndScore(false);
  };

  const handleRemoveSymbol = e => {
    const symbolToRemove = e.target.parentNode.parentNode.id;

    endScore && setEndScore(false);

    setScoreSymbols(currentSymbols => {
      const updatedScoreSymbol = {...currentSymbols};

      delete updatedScoreSymbol[symbolToRemove];

      return updatedScoreSymbol;
    });
  };

  const handleClickSavePDF = () => finishScoreHandler();

  const handleClearScore = () => {
    setScoreSymbols({});
    setEndSymbolPosition(null);
  };

  const handleCancel = () => {
    setMessage('');
    setSwapKey(null);
  }

  const handleToggleSymbolNames = () => symbolChoiceContainer.current.classList.toggle('open');

  const handleAddNewPage = () => {
    setPageNum(pageNum => pageNum + 1);
    setPageCount(pageCount => pageCount + 1);
  };

  const handleDeletePage = () => {
    setPageNum(pageNum => pageNum - 1);
    setPageCount(pageCount => pageCount - 1);
  };

  const handlePagination = e => {
    e.target.textContent === 'Next' ? setPageNum(pagenNum => pageNum + 1) : setPageNum(pagenNum => pageNum - 1);
  };

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

  const handleCloseNamingForm = () => {
    setShowNamingForm(false);
    endScore && setEndScore(false);
  };

  const getPageSymbols = () => {
    const allScoreSymbols = Object.entries(scoreSymbols);
    const pageSymbols = [];

    for (let i = (pageNum - 1) * 32; i < allScoreSymbols.length; i++ ) {
      if (pageSymbols.length === 32) {
        break;
      }

      pageSymbols.push(allScoreSymbols[i]);
    }

    pageSymbols.length !== pageSymbolCount && setPageSymbolCount(pageSymbols.length);

    return pageSymbols;
  }

  return (
    <div className="App">
      <header className="App-header">
          <h1>LOD Score Creator</h1>
      </header>
      <main className="flex">
        <section className="app-controls">
          <div ref={symbolChoiceContainer} className="symbol-choice-container">
            <button className="symbol-name-toggle flex flex-center" onClick={handleToggleSymbolNames}>
              <img src={chevron} alt="<" className="chevron" height="18" width="10" />
            </button>
            {Object.entries(symbols).map(([char, symbol]) => <figure className="symbol-btn flex-mob" key={symbol} onClick={addSymbol}>
                                    <Symbol class='btn-char-symbol' name={symbol} character={char} />
                                    <figcaption className='btn-name'>{symbol}</figcaption>
                                  </figure>)}
          </div>
          <div className="buttons flex">
              <button className="save-pdf btn primary-btn" onClick={handleClickSavePDF} {... !Object.keys(scoreSymbols).length && {disabled: 'disabled'}}>Download</button>
              <button className="clear-btn btn secondary-btn" onClick={handleClearScore} {... !Object.keys(scoreSymbols).length && {disabled: 'disabled'}}>Clear</button>
            </div>
        </section>
        <section className="score-content">
          <div className="score">
            <div className="pdf-container flex" ref={score}>
                {pageNum === 1 ? <span className="start-symbol flex"></span> : <span className={`continue-symbol flex flex-center continue-btm`}></span>}
                {getPageSymbols().map(([key,symbol], index) => {
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
              {(pageCount > pageNum && pageSymbolCount === 32) &&
                <span className={`continue-symbol flex flex-center continue-top continue-32`}></span>}
              {message && <Message message={message} handleCancel={handleCancel} />}
            </div>
            {showNamingForm && <NamePDF
                            handleSetScoreName={handleSetScoreName}
                            handleSaveScore={handleSaveScore}
                            scoreName={scoreName}
                            handleCloseNamingForm={handleCloseNamingForm} />}
          </div>
          {Object.keys(scoreSymbols).length >= 32 && <Pagination
                                                            pageSymbolCount={pageSymbolCount}
                                                            handleAddNewPage={handleAddNewPage}
                                                            handleDeletePage={handleDeletePage}
                                                            currentPage={pageNum}
                                                            pageCount={pageCount}
                                                            handlePagination={handlePagination} />}
        </section>
      </main>
    </div>
  );
}

export default App;
