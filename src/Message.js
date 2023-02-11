import React from "react";

const Message = props => (
    <div className="message flex">
        <p>{props.message}</p>{props.handleCancel && <span onClick={props.handleCancel}>Cancel</span>}
    </div>
);

export default Message;