import PropTypes from 'prop-types';
import AtomsStep from '@components/atoms/AtomsStep';

const Steps = ({ number, numberActive, titles, ...rest }) => {
    const Render = () => {
        let render = [];

        for (let index = 0; index < number; index++) {
            if (index + 1 === numberActive) {
                render.push(
                    <AtomsStep
                        {...rest}
                        key={index + 1}
                        number={index + 1}
                        type={'is-active'}
                        title={titles[`title${index + 1}`]}
                    />
                );
            } else if (index + 1 < numberActive) {
                render.push(
                    <AtomsStep
                        key={index + 1}
                        {...rest}
                        number={index + 1}
                        type={'is-completed'}
                        title={titles[`title${index + 1}`]}
                    />
                );
            } else {
                render.push(
                    <AtomsStep
                        number={index + 1}
                        key={index + 1}
                        {...rest}
                        title={titles[`title${index + 1}`]}
                    />
                );
            }
        }

        return render;
    };

    return (
        <ul className="steps is-small" id="steps">
            <Render />
        </ul>
    );
};

Steps.propTypes = {
    number: PropTypes.number.isRequired,
    numberActive: PropTypes.number.isRequired,
    titles: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Steps;