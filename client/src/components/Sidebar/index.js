import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { ArrowDown01Icon, ChartAverageIcon, GraduateMaleIcon, UserIcon } from 'hugeicons-react';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const Sidebar = ({ sidebarOpen }) => {
    const location = useLocation();
    const { pathname } = location;
    const { user } = useUserProvider();

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
    );

    return (
        <aside
            className={` left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-slate-900 duration-300 ease-linear lg:static lg:translate-x-0 text-white text-base ${
                sidebarOpen ? 'translate-x-0 block' : '-translate-x-full hidden'
            } `}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 mt-5 ml-3">
                <NavLink to="/">
                    <img width={200} src="/logo.png" alt="Logo" />
                </NavLink>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MENU</h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* <!-- Menu Item Dashboard --> */}
                            <SidebarLinkGroup activeCondition={pathname === '/' || pathname.includes('dashboard')}>
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                    (pathname === '/' || pathname.includes('dashboard')) &&
                                                    'bg-graydark '
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                }}
                                            >
                                                <ChartAverageIcon className="size-6" />
                                                Dashboard
                                                <ArrowDown01Icon
                                                    className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                        open && 'rotate-180'
                                                    }`}
                                                />
                                            </NavLink>
                                            {/* <!-- Dropdown Menu Start --> */}
                                            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/dashboards"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                (isActive && '!text-white')
                                                            }
                                                        >
                                                            Nhân viên
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {user.role === 'ADMIN' ? (
                                <>
                                    {' '}
                                    {/* <!-- Menu Item Dashboard --> */}
                                    {/* User */}
                                    <SidebarLinkGroup
                                        activeCondition={pathname === '/' || pathname.includes('dashboard/users')}
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' ||
                                                                pathname.includes('dashboard/users')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <UserIcon className="size-6" />
                                                        Quản lý người dùng
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/users/view-list?role=all"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách người dùng
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/users/create"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Tạo người dùng
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                </>
                            ) : (
                                <></>
                            )}

                            {/* User */}
                            {/* Academy */}
                            {user.role === 'STAFF' ? (
                                <>
                                    {' '}
                                    <SidebarLinkGroup
                                        activeCondition={pathname === '/' || pathname.includes('dashboard/academy')}
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' ||
                                                                pathname.includes('dashboard/academy')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Quản lý lớp
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/academy/view-list"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách lớp học
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/rooms"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách phòng học
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/academy/registed-academy?type=class"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Đơn đăng kí vào trường
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/academy/create?type=class"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Tạo lớp
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/academy/create-curriculum"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Tạo chương trình học
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/rooms/create-room"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Tạo phòng học
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                    <SidebarLinkGroup
                                        activeCondition={
                                            pathname === '/' || pathname.includes('dashboard/transportation')
                                        }
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' ||
                                                                pathname.includes('dashboard/transportation')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Quản lý xe đưa đón
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/transportation/view-list"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách xe
                                                                </NavLink>
                                                            </li>

                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/transportation/create-transportation"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Tạo phương tiện
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/transportation/view-register-transport"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Dịch vụ xe đưa đón
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                    <SidebarLinkGroup
                                        activeCondition={
                                            pathname === '/' || pathname.includes('dashboard/transportation')
                                        }
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' ||
                                                                pathname.includes('dashboard/transportation')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Phản hồi từ phụ huynh
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/view-feedback"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Xem phản đánh giá
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                </>
                            ) : (
                                <></>
                            )}

                            {user.role === 'DRIVER' ? (
                                <>
                                    {' '}
                                    <SidebarLinkGroup
                                        activeCondition={pathname === '/' || pathname.includes('dashboard/driver')}
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' ||
                                                                pathname.includes('dashboard/driver')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Quản lý xe của tài xế
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/driver/transportation-by-driver"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách xe của tài xế
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                </>
                            ) : (
                                <></>
                            )}
                            {user.role === 'ACCOUNTANT' ? (
                                <>
                                    {' '}
                                    <SidebarLinkGroup
                                        activeCondition={pathname === '/' || pathname.includes('dashboard')}
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' || pathname.includes('dashboard')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Quản lý giao dich
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/transactions"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách giao dịch
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                </>
                            ) : (
                                <></>
                            )}
                            {user.role === 'TEACHER' ? (
                                <>
                                    {' '}
                                    <SidebarLinkGroup
                                        activeCondition={pathname === '/' || pathname.includes('dashboard')}
                                    >
                                        {(handleClick, open) => {
                                            return (
                                                <React.Fragment>
                                                    <NavLink
                                                        to="#"
                                                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
                                                            (pathname === '/' || pathname.includes('dashboard')) &&
                                                            'bg-graydark '
                                                        }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                                        }}
                                                    >
                                                        <GraduateMaleIcon className="size-6" />
                                                        Quản lý lớp của giáo viên
                                                        <ArrowDown01Icon
                                                            className={`absolute size-6 right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                                open && 'rotate-180'
                                                            }`}
                                                        />
                                                    </NavLink>
                                                    {/* <!-- Dropdown Menu Start --> */}
                                                    <div
                                                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                                                    >
                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/my-class"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách lớp học
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink
                                                                    to="/dashboards/my-skill"
                                                                    className={({ isActive }) =>
                                                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                        (isActive && '!text-white')
                                                                    }
                                                                >
                                                                    Danh sách lớp kỹ năng
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {/* <!-- Dropdown Menu End --> */}
                                                </React.Fragment>
                                            );
                                        }}
                                    </SidebarLinkGroup>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* Academy */}
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;
