import { useState, useEffect } from 'react';
import { useStore } from 'zustand';
import useAuthStore from '@store/authStore';
import appStore from '@store/appStore';
import { fetchContactData, fetchCompanyData, fetchActivitiesData } from '@src/lib/api/apiUser';
import { getConfigTable as getContactConfigTable } from "../contact/config/configTable";
import { getConfigTable } from "./config/configTable";
import CompanyInfo from '@components/organisms/company/OrganismsCompanyInfo';

const Company = () => {
  const idUser = useStore(useAuthStore, state => state.idUser);
  const idCompany = useStore(appStore, state => state.idCompany);
  const [companyData, setCompanyData] = useState(null);
  const [contactData, setContactData] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyDataAsync = async () => {
    if (idUser) {
      try {
        const data = await fetchCompanyData(idUser);
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {

    fetchCompanyDataAsync();
  }, [idUser]);

  const fetchContactDataAsync = async () => {
    if (idCompany) {
      try {
        const data = await fetchContactData(idCompany);
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    }
  };
  useEffect(() => {

    fetchContactDataAsync();
  }, [idCompany]);

  const fetchActivitiesDataAsync = async () => {
    if (idCompany) {
      try {
        const data = await fetchActivitiesData(idCompany);
        setActivitiesData(data);
      } catch (error) {
        console.error('Error fetching activities data:', error);
      }
    }
  };
  useEffect(() => {

    fetchActivitiesDataAsync();
  }, [idCompany]);

  const configTable = getConfigTable(activitiesData,fetchActivitiesDataAsync);
  const configTableContact = getContactConfigTable(contactData, fetchContactDataAsync);

  const onUpdate = () => {
    fetchCompanyDataAsync();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
        <CompanyInfo
          companyData={companyData}
          configTableContact={configTableContact}
          configTable={configTable}
          onUpdate={onUpdate}
        />
      
    </>
  );
};

export default Company;