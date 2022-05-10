const symbol = props => (
    <div className={props.class || null}>
        {props.options && <span className="options">...</span>}
        <p className={props.name || null}>{props.character}</p>
    </div>    
);

export default symbol;