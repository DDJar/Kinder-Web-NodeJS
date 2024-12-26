import { useState } from 'react';

export function useSearch() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredSalary, setFilteredSalary] = useState([]);

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleSearchSubmit = (salaries) => {
        const filtered = salaries.filter((salaries) =>
            salaries.payMethod.toLowerCase().includes(searchKeyword.toLowerCase()),
        );
        setFilteredSalary(filtered);
    };

    return { searchKeyword, filteredSalary, handleSearchChange, handleSearchSubmit };
}
