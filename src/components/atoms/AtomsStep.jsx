import PropTypes from 'prop-types';

export const AtomsStep = ({ type, number, insertStep, title }) => {
    return (
        <li className={`step-item ${type}`} onClick={() => insertStep(number)}>
            <div className={`step-marker ${type}`}></div>
            <div className="step-details is-primary is-completed">
                <p className="step-title">{number}</p>
                <p>{title}</p>
            </div>
        </li>
    );
};

AtomsStep.propTypes = {
    type: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    insertStep: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default AtomsStep;