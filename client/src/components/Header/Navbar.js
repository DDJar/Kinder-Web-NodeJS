import { useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { NavLink, useLocation } from 'react-router-dom';
import PopoverComp from '../Popover';
import Button from '../Button';
import {
    MentoringIcon,
    Bus03Icon,
    // Calendar03Icon,
    Cancel01Icon,
    // ChartColumnIcon,
    CreditCardPosIcon,
    Megaphone01Icon,
    Menu01Icon,
    // PaintBoardIcon,
    MapsLocation01Icon,
} from 'hugeicons-react';
import { Employees } from '~/constants';

const communications = [
    { name: 'Thông Báo', description: 'Thông báo từ nhà trường', to: '/annouce', icon: Megaphone01Icon },
    { name: 'Hướng dẫn', description: 'Hướng dẫn cài đặt camera Hik vision', to: '/camera-guide', icon: MentoringIcon },
];
const childServices = [
    // { name: 'Đăng kí lớp kĩ năng', to: '/academy/skilles', icon: PaintBoardIcon, isRequireLogin: true },
    // { name: 'Báo cáo điểm danh', to: '/attendance', icon: ChartColumnIcon, isRequireLogin: true },
    // { name: 'Thời khoá biểu', to: '/schedule', icon: Calendar03Icon, isRequireLogin: true },
    { name: 'Đăng ký dịch vụ đưa đón', to: '/register-transport', icon: Bus03Icon, isRequireLogin: true },
    { name: 'Thanh Toán', to: '/payment', icon: CreditCardPosIcon, isRequireLogin: true },
    { name: 'Theo dõi tuyến đường của trẻ', to: '/bus-services', icon: MapsLocation01Icon, isRequireLogin: true },
    // { name: 'Bảng luơng', to: '/persalary', icon: CreditCardPosIcon },
];

// eslint-disable-next-line no-unused-vars
function Navbar({ user }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isEmployee, setIsEmployee] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('dashboards') && user?.role !== 'USER') {
            setIsEmployee(true);
        }
    }, [location.pathname]);
    return (
        <div>
            {!isEmployee ? (
                <>
                    <nav
                        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
                        aria-label="Global"
                    >
                        <div className="flex lg:flex-1">
                            <NavLink to={'/'} className="-m-1.5 p-1.5">
                                <span className="sr-only">KindergartenABC</span>
                                <img className="h-16 w-auto" src="/logo.png" width={100} alt="Logo KindergartenABC" />
                            </NavLink>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu01Icon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-12 gap-x-4 items-center ml-10">
                            {user ? (
                                Employees.includes(user.role) ? (
                                    <NavLink to="/dashboards" className="text-sm font-semibold leading-6 text-gray-900">
                                        Admin Page
                                    </NavLink>
                                ) : (
                                    ''
                                )
                            ) : (
                                ''
                            )}

                            <PopoverComp button={<Button text>Dịch vụ</Button>} left iconRight>
                                <div className="p-4 w-94">
                                    {childServices.map((item) => {
                                        if (!item.isRequireLogin) {
                                            return (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                                >
                                                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <item.icon
                                                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <NavLink
                                                            to={user ? item.to : '/login'}
                                                            className="block font-semibold text-gray-900"
                                                        >
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </NavLink>
                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        if (user && item.isRequireLogin) {
                                            return (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                                >
                                                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <item.icon
                                                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <NavLink
                                                            to={item.to}
                                                            className="block font-semibold text-gray-900"
                                                        >
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </NavLink>
                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </PopoverComp>
                            <PopoverComp button={<Button text>Cộng đồng</Button>} left iconRight>
                                <div className="p-4 w-94">
                                    {communications.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                        >
                                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                <item.icon
                                                    className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="flex-auto">
                                                <NavLink
                                                    to={user ? item.to : '/login'}
                                                    className="block font-semibold text-gray-900"
                                                >
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </NavLink>
                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverComp>
                        </div>
                    </nav>
                    <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                        <div className="fixed inset-0 z-10" />
                        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <NavLink href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <img className="h-8 w-auto" src="logo.png" alt="" />
                                </NavLink>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <Cancel01Icon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <NavLink
                                            to="#"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
                                        >
                                            Features
                                        </NavLink>
                                        {[...communications, ...childServices].map((service, index) => (
                                            <Button
                                                text
                                                to={service.to}
                                                key={index}
                                                target="_self"
                                                icon={<service.icon />}
                                            >
                                                {service.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </Dialog>
                </>
            ) : (
                ''
            )}
        </div>
    );
}

export default Navbar;
