import { useState, useEffect } from 'react';

const SidebarLinkGroup = ({ children, activeCondition }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    useEffect(() => {
        if (activeCondition) {
            setOpen(activeCondition);
        }
    }, [activeCondition]);
    return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
