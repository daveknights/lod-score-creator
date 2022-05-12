const symbol = props => {
    const pClasses = ['hg-font', ` ${props.name}` || null].join('');

    return <div className={props.class || null}>
        {props.options && <span className="options" onClick={props.optionsHandlerFn}>...</span>}
        <p className={pClasses}>{props.character}</p>
    </div>    
};

export default symbol;