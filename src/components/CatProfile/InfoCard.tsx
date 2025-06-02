import React from 'react';
import type { InfoCardProps } from '../../types/CatProfile/InfoCardProps';


const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, subtitle }) => (
  <div className="bg-purple-50 p-4 rounded-lg">
    <div className="flex items-center mb-2">
      {icon && <span className="h-6 w-6 text-purple-500 mr-2">{icon}</span>}
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="text-lg font-semibold">{value}</p>
    {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
  </div>
);

export default InfoCard; 