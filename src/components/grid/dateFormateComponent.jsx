import React from 'react';
import PropTypes from 'prop-types';

const DateFormateComponent = ({ data, format = 'date', style = {} }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';

    try {
      const [hours, minutes] = timeString.split(':');
      if (!hours || !minutes) return timeString;

      const hour = parseInt(hours, 10);
      const min = parseInt(minutes, 10);

      if (isNaN(hour) || isNaN(min)) return timeString;

      const period = hour >= 12 ? '' : '';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

      return `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const formattedDate = formatDate(dateString);
    const formattedTime = formatTime(timeString);

    if (formattedDate === '-' && formattedTime === '-') return '-';
    if (formattedDate === '-') return formattedTime;
    if (formattedTime === '-') return formattedDate;

    return `${formattedDate} ${formattedTime}`;
  };

  const renderContent = () => {
    switch (format) {
      case 'time':
        return formatTime(data);
      case 'date':
        return formatDate(data);
      case 'datetime':
        return formatDateTime(data?.date || data, data?.time);
      default:
        return formatDate(data);
    }
  };

  return (
    <span className={style.text || 'text-gray-900'}>
      {renderContent()}
    </span>
  );
};

DateFormateComponent.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  format: PropTypes.oneOf(['date', 'time', 'datetime']),
  style: PropTypes.object
};

export default DateFormateComponent;