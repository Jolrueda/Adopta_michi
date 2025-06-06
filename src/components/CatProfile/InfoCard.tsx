import React from 'react';
import type { InfoCardProps } from '../../types/CatProfile/InfoCardProps';


const InfoCard: React.FC<InfoCardProps> = ({ icon, title, subtitle }) => (
  <div className="bg-purple-50 p-4 rounded-lg">
    <div className="flex items-center mb-2">
      {icon && <span className="h-6 w-6 text-purple-500 mr-2">{icon}</span>}
      <p className="text-lg font-semibold">{title}</p>

    </div>
    {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
  </div>
);

export default InfoCard; 