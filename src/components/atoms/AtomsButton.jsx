const AtomsButton = ({text, event}) => {
    return (
        <button type="submit"className="button is-fullwidth bg-primary mb-4 text-white hover:text-white hover:bg-primary-light" onClick={event}>
            {text}
        </button>
    );
};

export default AtomsButton;