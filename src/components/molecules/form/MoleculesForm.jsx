import React from 'react';
import AtomsSelect from '@components/atoms/AtomsSelect';
import AtomsButton from '@components/atoms/AtomsButton';
import AtomsInputText from '@components/atoms/AtomsInputText';

const MoleculeForm = ({ inputsConfig, buttonConfig, handleSubmit, formRef }) => {
    return (
        <form onSubmit={handleSubmit} ref={formRef}>
            {inputsConfig.map((input, index) => {
                if (input.type === 'select') {
                    return <AtomsSelect key={index} config={input} event={input.event} />;
                } else {
                    return <AtomsInputText key={index} config={input} />;
                }
            })}
            <AtomsButton text={buttonConfig.text} event={buttonConfig.event} />
        </form>
    );
};

export default MoleculeForm;