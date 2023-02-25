const NamePDF = props => (
    <form className="name-pdf-form" onSubmit={props.handleSaveScore}>
        <span className="remove-symbol close-form" onClick={props.handleCloseNamingForm}></span>
        <label htmlFor="score-name">Score name:</label>
        <input id="score-name" type="text" placeholder="lod score" value={props.scoreName} onChange={props.handleSetScoreName} />
        <button type="submit" className="name-pdf-btn btn primary-btn">Save</button>
    </form>
);

export default NamePDF;