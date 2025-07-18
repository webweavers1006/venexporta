import React from 'react';
import { useParams } from 'react-router';
import CompaniesOnlyView from './CompaniesOnlyView';
import { useCompaniesOnly } from './hooks/useCompaniesOnly';

const CompaniesOnly = () => {
  const { id, event, renderSchedule } = useParams();
  const {
    productsCompany,
    companyEvents,
    scheduleBlocks,
    economicActivities,
    subEconomicSectors,
    companyDocuments,
    reloadScheduleBlocks,
  } = useCompaniesOnly({ id, event });

  return (
    <CompaniesOnlyView
      renderSchedule={renderSchedule}
      scheduleBlocks={scheduleBlocks}
      reloadScheduleBlocks={reloadScheduleBlocks}
      id={id}
      event={event}
      companyEvents={companyEvents}
      subEconomicSectors={subEconomicSectors}
      economicActivities={economicActivities}
      companyDocuments={companyDocuments}
      productsCompany={productsCompany}
    />
  );
};

export default CompaniesOnly;