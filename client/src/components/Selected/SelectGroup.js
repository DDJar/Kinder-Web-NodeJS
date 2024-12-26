import { ArrowDown01Icon } from 'hugeicons-react';
import React, { useState } from 'react';

const SelectGroup = ({ data, selectedOption, setSelectedOption }) => {
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    return (
        <div className="">
            <div className="relative z-20 bg-transparent flex items-center mb-0 ">
                <select
                    value={selectedOption}
                    onChange={(e) => {
                        setSelectedOption(e.target.value);
                        changeTextColor();
                    }}
                    className={`mb-0 relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary  ${
                        isOptionSelected ? 'text-black ' : ''
                    }`}
                >
                    <option value="" disabled className="text-body ">
                        Lựa chọn...
                    </option>

                    {data &&
                        data.map((dt) => (
                            <option key={dt.value} value={dt.value} className="text-body ">
                                {dt.title}
                            </option>
                        ))}
                </select>

                <div className="absolute top-6 right-2  z-30 -translate-y-1/2 mb-0">
                    <ArrowDown01Icon className={`size-6  `} />
                </div>
            </div>
        </div>
    );
};

export default SelectGroup;
