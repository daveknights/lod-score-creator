import { useState } from "react";

const Symbol = props => {
    const [showSymbolActions, setShowSymbolActions] = useState(false);
    const pClasses = ['hg-font', ` ${props.name}` || null].join('');

    const handleShowSymbolActions = () => setShowSymbolActions(!showSymbolActions);

    const handleHideSymbolActions = () => setShowSymbolActions(false);

    const clickClass = props.options ? handleShowSymbolActions : null;

    return <div id={props.id} className={props.class || null} tabIndex="0" onClick={clickClass} onBlur={handleHideSymbolActions}>
                {showSymbolActions && (<div className="symbol-actions">
                    {props.options && (<div className="swap-symbol flex column" onClick={props.handleSwapSymbol}>
                                        <span>&rarr;</span>
                                        <span>&larr;</span>
                                    </div>)}
                    {props.options && <span className="remove-symbol" onClick={props.handleRemoveSymbol}>X</span>}
                </div>)}
                <p className={pClasses}>{props.character}</p>
            </div>;
};

export default Symbol;