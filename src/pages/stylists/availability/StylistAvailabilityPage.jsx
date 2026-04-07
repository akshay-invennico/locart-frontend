import React from 'react'
import HolidayPage from './holiday/HolidayPage';
import OperatingHoursPage from './operatinghours/OperatingHoursPage';

const StylistAvailabilityPage = () => {
  return (
    <div className="w-full h-full">
      <OperatingHoursPage />
      <HolidayPage />
    </div>
  )
}

export default StylistAvailabilityPage;
