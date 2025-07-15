import React from 'react';

const AtomsSelectCenter = React.memo(({ insertSiteCenter, site, options }) => {
    return (
        <div className='mb-5 mt-4 flex justify-center'>
            {options.map((option, index) => (
                <span
                    key={index}
                    className={`${site === option.value ? '' : 'has-text-grey-light'} px-2 has-text-weight-semibold is-pointer is-size-5`}
                    id={option.value}
                    onClick={() => insertSiteCenter(option.value)}
                >
                    {option.label}
                </span>
            ))}
        </div>
    );
});

export default AtomsSelectCenter;