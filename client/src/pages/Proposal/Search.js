import { useState } from 'react';

export function useSearch() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredProposals, setFilteredProposals] = useState([]);

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleSearchSubmit = (proposals) => {
        const filtered = proposals.filter((proposal) =>
            proposal.title.toLowerCase().includes(searchKeyword.toLowerCase()),
        );
        setFilteredProposals(filtered);
    };

    return { searchKeyword, filteredProposals, handleSearchChange, handleSearchSubmit };
}
