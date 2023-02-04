const Symbol = props => {
    const pClasses = ['hg-font', ` ${props.name}` || null].join('');

    return <div id={props.id} className={props.class || null}>
                {props.options && <span className="remove-symbol" onClick={props.handleRemoveSymbol}>X</span>}
                <p className={pClasses}>{props.character}</p>
            </div>;
};

export default Symbol;