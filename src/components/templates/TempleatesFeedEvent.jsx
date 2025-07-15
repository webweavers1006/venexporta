import { Suspense, lazy } from 'react';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
const MoleculesTable = lazy(() => import('@components/molecules/tables/MoleculesTable'));
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


const TempleatesFeedEvent = ({ configTable, title, subtitle }) => {
    return (
        <Suspense fallback={<div>Loading table...</div>}>
                <AtomsPanel title={title} subtitle={subtitle} />

                <div className="min-h-[100vh] flex-1 rounded-2xl bg-white md:min-h-min mt-4">
                    <MoleculesTable config={configTable} />
                </div>

        </Suspense>
    );
};

export default TempleatesFeedEvent;