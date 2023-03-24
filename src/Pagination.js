const Pagination = props => {
    const isLastPage = props.currentPage === props.pageCount;
    let newPageBtn = null;
    let deletePageBtn = null;
    let prevBtn = null;
    let nextBtn = null;

    if (props.pageSymbolCount > 1 && props.pageSymbolCount % 32 === 0
        && isLastPage) {
        newPageBtn = true;
    }

    if (isLastPage && props.pageSymbolCount === 0) {
        deletePageBtn = true;
    }

    if (props.pageCount > 1) {
        prevBtn = true;
        nextBtn = true;
    }

    const newOnly = newPageBtn && props.pageCount === 1 ? ' new-only' : '';

    return (<div className={`pagination flex${newOnly}`}>
                {prevBtn && <button type="button" className="btn primary-btn pagination-btn" onClick={props.handlePagination} {...props.currentPage === 1 && {disabled: 'disabled'}}>Prev</button>}
                {newPageBtn && <button type="button" className="btn secondary-btn add-new-page" onClick={props.handleAddNewPage}>Add new page +</button>}
                {deletePageBtn && <button type="button" className="btn secondary-btn add-new-page" onClick={props.handleDeletePage}>Delete page x</button>}
                {nextBtn && <button type="button" className="btn primary-btn pagination-btn next-btn" onClick={props.handlePagination} {...isLastPage && {disabled: 'disabled'}}>Next</button>}
            </div>);
};

export default Pagination;