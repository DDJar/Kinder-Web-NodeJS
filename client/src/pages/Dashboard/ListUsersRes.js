import React from 'react';
import { convertContentVN } from '~/utils/message';

const ListUsersRes = ({ data }) => {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="bg-[#42b3c5] text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-2 py-3">
                        STT
                    </th>
                    <th scope="col" className="px-2 py-3">
                        Họ và tên
                    </th>
                    <th scope="col" className="px-2 py-3">
                        Username
                    </th>
                    <th scope="col" className="px-2 py-3">
                        Role
                    </th>
                    <th scope="col" className="px-2 py-3">
                        Trạng thái
                    </th>
                </tr>
            </thead>
            <tbody>
                {data &&
                    data.map((user) => (
                        <tr className={`border-b dark:border-gray-700`} key={user.index}>
                            <th scope="row" className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase">
                                {user.index}
                            </th>
                            <th className="p-2 text-gray-900 whitespace-nowrap ">
                                {user.firstName} {user.lastName}
                            </th>
                            <th className="p-2 text-gray-900 whitespace-nowrap ">{user.username}</th>
                            <th className="p-2  text-gray-900 whitespace-nowrap ">{user.role}</th>
                            <th className={`p-2  ${user.isCreated ? `text-success` : `text-error`} whitespace-nowrap `}>
                                {user.isCreated ? 'Tạo Thành Công' : `${convertContentVN(user.message)}`}
                            </th>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default ListUsersRes;
