import { useState } from 'react';

export function useSearch() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredAnnoucement, setFilteredAnnoucement] = useState([]);

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleSearchSubmit = (annoucements) => {
        const filtered = annoucements.filter((proposal) =>
            proposal.title.toLowerCase().includes(searchKeyword.toLowerCase()),
        );
        setFilteredAnnoucement(filtered);
    };

    return { searchKeyword, filteredAnnoucement, handleSearchChange, handleSearchSubmit };
}
