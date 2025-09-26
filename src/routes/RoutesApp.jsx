import { Route, Routes } from 'react-router';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import logo from '@assets/logo/isologoA.png';
import PrivateRoute from './PrivateRoute';
import { useStore } from 'zustand';
import appStore from '@store/appStore';

const FeedEvent = lazy(() => import('@pages/events/FeedEvent'));
const EventInfo = lazy(() => import('@pages/events/EventInfo'));
const MyFeedEvent = lazy(() => import('@pages/events/MyFeedEvent'));
const CenterLoginRegister = lazy(() => import('@pages/centerLogin/CenterLogin'));
const LayoutContent = lazy(() => import('@src/Layout'));
const Company = lazy(() => import('@pages/company/Company'));
const registerActivities = lazy(() => import('@pages/activities/RegisterActivities'));
const Home = lazy(() => import('@pages/home/Home'));
const Contact = lazy(() => import('@pages/contact/Contact'));
const RegisterForm = lazy(() => import('@pages/centerLogin/Signup'));
const Dashboard = lazy(() => import('@pages/admin/dashboard/Dashboard'));
const CompanyFormRegister = lazy(() => import('@pages/company/CompanyRegister'));
const ForgotPassword = lazy(() => import('@pages/user/ForgotPassword'));
const RegisterProducts = lazy(() => import('@pages/products/ProductsRegister'));
const MyProducts = lazy(() => import('@pages/products/MyProducts'));
const Companies = lazy(() => import('@pages/roundtable/companies/Companies'));
const CompaniesOnly = lazy(() => import('@pages/roundtable/companies/CompaniesOnly'));
const AppointmentsReceived = lazy(() => import('@pages/appointments/AppointmentsReceived'));
const AppointmentsSend = lazy(() => import('@pages/appointments/AppointmentsSend'));
const EventRequests = lazy(() => import('@pages/admin/events/EventRequests'));
const ListCompanies = lazy(() => import('@pages/admin/companies/ListCompanies'));
const ListCompaniesOnly = lazy(() => import('@pages/admin/companies/ListCompaniesOnly'));
const SchedulesEvents = lazy(() => import('@pages/admin/schedules/SchedulesEvents'));
const Reports = lazy(() => import('@pages/admin/reportes/Reportes'));
const ReportesCitas = lazy(() => import('@pages/admin/reportes/ReportesCitas'));
const ReportsDinamics = lazy(() => import('@pages/admin/reportes/ReportesDinamicos'));
const ReportesDinamicosEventosActividad = lazy(() => import('@pages/admin/reportes/ReportesDinamicosEventosActividad'));
const HomePage = lazy(() => import('@pages/homepage/HomePage'));
const QrDinamic = lazy(() => import('@pages/admin/QR/Qr'));

const RoutesApp = () => {
    const idPais = useStore(appStore, state => state.idPais);

    return (
        <Suspense fallback={<Spin indicator={<img src={logo}/>} size="large" tip={<p className='text-primary font-bold italic font-sans'>Venexporta</p>} fullscreen/>}>
            <Routes>
                <Route path="/" element={<LayoutContent />}>
                    <Route path="/" element={<PrivateRoute component={Home} />} />
                    <Route path="event/feed" element={<PrivateRoute component={FeedEvent} />} />
                    <Route path="company/register" element={<PrivateRoute component={CompanyFormRegister} />} />
                    <Route path="company" element={<PrivateRoute component={Company} />} />
                    <Route path="dashboard" element={<PrivateRoute component={Dashboard} />} />
                    <Route path="Reports" element={<PrivateRoute component={Reports} />} />
                    <Route path="Reports/Appointments" element={<PrivateRoute component={ReportesCitas} />} />
                    <Route path="reports/dinamics" element={<PrivateRoute component={ReportsDinamics} />} />
                    <Route path="reports/dinamics/ex" element={<PrivateRoute component={ReportesDinamicosEventosActividad} />} />
                    <Route path="list/companies" element={<PrivateRoute component={ListCompanies} />} />
                    <Route path="schedules/event" element={<PrivateRoute component={SchedulesEvents} />} />
                    <Route path="contacts" element={<PrivateRoute component={Contact} />} />
                    <Route path="activities" element={<PrivateRoute component={registerActivities} />} />
                    <Route path="myevent/feed" element={<PrivateRoute component={MyFeedEvent} />} />
                    <Route path="event/feed/:id" element={<PrivateRoute component={EventInfo} />} />
                    <Route path="qr/dinamic" element={<PrivateRoute component={QrDinamic} />} />
                    {/* idPais === 95 && */ (
                        <>
                            <Route path="product/register" element={<PrivateRoute component={RegisterProducts} />} />
                            <Route path="products" element={<PrivateRoute component={MyProducts} />} />
                            <Route path="appointmentsReceived" element={<PrivateRoute component={AppointmentsReceived} />} />
                        </>
                    )}
                    <Route path="appointmentsSend" element={<PrivateRoute component={AppointmentsSend} />} />
                    <Route path="requests/event" element={<PrivateRoute component={EventRequests} />} />
                    {/* idPais !== null && idPais !== undefined && idPais !== 95 && */ (
                        <Route path="roundtable/companies" element={<PrivateRoute component={Companies} />} />
                    )}
                    <Route path="list/companies/:id" element={<PrivateRoute component={ListCompaniesOnly} />} />
                    <Route path="roundtable/companies/:id/:event/:renderSchedule" element={<PrivateRoute component={CompaniesOnly} />} />
                </Route>
                <Route path="/home" element={<HomePage />} />
                <Route path="login" element={<CenterLoginRegister />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="signup" element={<RegisterForm />} />
            </Routes>
        </Suspense>
    );
}

export default RoutesApp;