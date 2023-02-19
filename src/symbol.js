import { useState } from "react";

const Symbol = props => {
    const [showSymbolActions, setShowSymbolActions] = useState(false);
    const pClasses = ['hg-font', ` ${props.name}` || null].join('');

    const handleShowSymbolActions = () => setShowSymbolActions(!showSymbolActions);

    const handleHideSymbolActions = () => setShowSymbolActions(false);

    const clickClass = props.options ? handleShowSymbolActions : null;

    return <div id={props.id} className={props.class || null} tabIndex="0" onClick={clickClass} onBlur={handleHideSymbolActions}>
                {showSymbolActions && (<div className="symbol-actions">
                    {props.options && (<span className="swap-symbol" onClick={props.handleSwapSymbol}></span>)}
                    {props.options && <span className="remove-symbol" onClick={props.handleRemoveSymbol}></span>}
                </div>)}
                <p className={pClasses}>{props.character}</p>
            </div>;
};

export default Symbol;
