import React from 'react';
import PageTitle from '~/common/PageTitle';

function HistoryRegist() {
    return (
        <div className="rounded-lg w-full flex justify-center">
            <PageTitle title="Kindergarten | historyregist" />

            <div className=" bg-white rounded-lg m-4 w-full container flex justify-around space-x-2">
                <div className="flex flex-col w-full h-full pb-6 py-2 px-10">
                    <h3 className="mb-3 text-4xl font-extrabold text-secondary">Điểm danh</h3>
                </div>
            </div>
        </div>
    );
}

export default HistoryRegist;
