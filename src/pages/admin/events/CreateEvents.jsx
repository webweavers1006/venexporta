import React from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import EventForm from '@components/EventForm';

function CreateEvents({ panelTitle = 'Eventos', panelSubtitle = 'Registro de eventos', children }) {
	return (
		<>
			<AtomsPanel
				title={panelTitle}
				subtitle={panelSubtitle}
				aria-label="Panel de registro de eventos"
			/>
			<div className="flex flex-col gap-6 mt-4" role="region" aria-label="Formulario de registro de eventos">
				<EventForm />
				{children}
			</div>
		</>
	);
}

CreateEvents.propTypes = {
	panelTitle: PropTypes.string,
	panelSubtitle: PropTypes.string,
	children: PropTypes.node,
};

export default CreateEvents;
