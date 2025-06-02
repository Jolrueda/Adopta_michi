import React from 'react';
import InfoCard from './InfoCard';
import type { InfoGridProps } from '../../types/CatProfile/InfogridProps';



const AgeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10m-12 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const HealthIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7 12a5 5 0 0110 0v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z"
    />
  </svg>
);

const InfoGrid: React.FC<InfoGridProps> = ({
  age,
  health,
  description,
  medicalConditions,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <InfoCard icon={AgeIcon} title="Edad" value={age} />
    <InfoCard icon={HealthIcon} title="Salud" value={health} />
    <InfoCard
      title="Descripción"
      value={description.title}
      subtitle={description.subtitle}
    />
    <InfoCard
      title="Condiciones médicas"
      value={medicalConditions.title}
      subtitle={medicalConditions.subtitle}
    />
  </div>
);

export default InfoGrid; 