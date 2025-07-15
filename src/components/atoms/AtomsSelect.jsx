const AtomsSelect = ({ config, event, value }) => {
    return (
        <div className="control has-icons-right pb-4">
            <div className="select is-fullwidth">
                <select value={value} name={config.name} required onChange={event}>
                    {config.options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>
            </div>
            <span className="icon is-small is-right">
                <i className={config.icon}></i>
            </span>
        </div>
    );
};

export default AtomsSelect;