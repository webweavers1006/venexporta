import React from 'react';

const AtomsInputText = React.memo(({ config }) => {
    return (
        <div className="control has-icons-right pb-4">
            <input className="input" type={config.type} name={config.name} placeholder={config.text} onChange={config.event} />
            <span className="icon is-small is-right">
                <i className={config.icon}></i>
            </span>
        </div>
    );
});

export default AtomsInputText;