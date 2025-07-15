import React from "react";
import CustomCard from "@components/molecules/card/MoleculesCard";
import { CardTitle, CardDescription } from "@/components/ui/card";
import MolueculesRadialChart from "@components/molecules/charts/MoleculesRadialBar";
import MoleculesCountrySelector from "./MoleculesCountrySelector";

/**
 * Tarjeta de empresas con selector de país y gráfico radial.
 */
function MoleculesEmpresasCard({ currentDate, paises, selectedPais, onSelectPais, firstApiData, secondApiData }) {
  return (
    <CustomCard
      header={
        <>
          <CardTitle>Empresas Registradas</CardTitle>
          <CardDescription>{currentDate}</CardDescription>
          <MoleculesCountrySelector paises={paises} selectedPais={selectedPais} onSelectPais={onSelectPais} />
        </>
      }
    >
      <MolueculesRadialChart data={firstApiData} config={{
        visitors: { label: "Empresas" },
        safari: { label: "Safari", color: "hsl(var(--chart-2))" },
      }} endAngle={secondApiData?.[0]?.visitors} />
    </CustomCard>
  );
}

export default MoleculesEmpresasCard;
