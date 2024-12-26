import { getCurrentMonthYear } from '~/utils/time';
import React from 'react';

const SelectedMonthYear = ({ currentDate, handleChangeCurrentMonth }) => {
    return (
        <input
            type="month"
            id="start"
            name="start"
            max={getCurrentMonthYear()}
            value={currentDate}
            onChange={(e) => handleChangeCurrentMonth(e.target.value)}
            className="block max-w-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 "
        />
    );
};
export default SelectedMonthYear;
