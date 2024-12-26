import React, { useState } from 'react';
import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from 'hugeicons-react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark ">
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} />
                <div className="flex items-center bg-slate-900">
                    <button
                        className="w-7 h-30 text-white hover:cursor-pointer"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <ArrowLeftDoubleIcon /> : <ArrowRightDoubleIcon />}
                    </button>
                </div>
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 bg-slate-100">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
