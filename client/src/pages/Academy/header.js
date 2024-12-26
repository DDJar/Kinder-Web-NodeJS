import React, { useState, useEffect } from 'react';
import SelectGroup from '~/components/Selected';

const AcademyHeader = ({ sortCriteria, search, onSortChange, onSearchChange }) => {
    const [selectedSort, setSelectedSort] = useState(sortCriteria);
    const SearchValue = [
        { value: 'all', title: 'Tất Cả' },
        { value: '3', title: '3 tuổi' },
        { value: '4', title: '4 tuổi' },
        { value: '5', title: '5 tuổi' },
        { value: '6', title: '6 tuổi' },
    ];
    useEffect(() => {
        onSortChange(selectedSort);
    }, [selectedSort, onSortChange]);

    const handleSortChange = (value) => {
        setSelectedSort(value);
    };
    return (
        <>
            <div className="tab-content">
                <div className=" flex">
                    <div className="mr-3 ">
                        <div className="flex ">
                            <SelectGroup
                                data={SearchValue}
                                selectedOption={selectedSort}
                                setSelectedOption={handleSortChange}
                            />
                        </div>
                    </div>
                    <div className="max-w-md w-full">
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Tìm
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AcademyHeader;
