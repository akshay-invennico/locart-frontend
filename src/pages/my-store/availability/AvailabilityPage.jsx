import React from 'react'
import HolidayPage from './holiday/HolidayPage';
import OperatingHoursPage from '@/pages/my-store/availability/operatinghours/OperatingHoursPage';

const AvailabilityPage = () => {
  return (
    <div className="w-full h-full">
      <OperatingHoursPage />
      <HolidayPage />
    </div>
  )
}

export default AvailabilityPage;
