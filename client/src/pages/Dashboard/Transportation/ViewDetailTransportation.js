import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
// import Modal from '~/components/Modal';
import { _getUsers } from '~/api/user';
import { PencilEdit02Icon, UserAdd01Icon } from 'hugeicons-react';
import Modal from '~/components/Modal';
import SelectGroup from '~/components/Selected';
import { getAge } from '~/utils/form';
import { getChildrenByTransport, updateTransportationServiceById } from '~/api/transportation';

function ViewDetailTransportation() {
    const [childTransportation, setChildrenTransportation] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const transportId = queryParams.get('transportId');
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const [titleModal, setTitleModal] = useState([]);
    const [driversSelect, setDriversSelect] = useState([]);
    const [selectedOptionDriver, setSelectedOptionDriver] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        totalSeats: '',
        busNumber: '',
        tuition: '',
        availableSeats: '',
        selectedOptionDriver: '',
    });

    useEffect(() => {
        fetchData();
    }, [location.pathname, transportId]);
    useEffect(() => {
        if (selectedTransportation) {
            setSelectedOptionDriver(selectedTransportation.driverId);
        }
    }, [selectedTransportation]);

    useEffect(() => {
        if (users) {
            let _driversSelect = users.map((user) => ({
                value: user._id,
                title: `${user.firstName} ${user.lastName}`,
            }));
            setDriversSelect(_driversSelect);
        }
    }, [users]);
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'DRIVER' },
                });
                if (res.data.status === 200) {
                    setUsers(res.data.data.users);
                }
            } catch (error) {
                const id = toast.loading('Làm ơn đợi...');
                toast.error(id, {
                    render: `Hiển thị thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };
        fetchAllUsers();
    }, []);

    const fetchData = async () => {
        const data = {
            transportId: transportId,
        };
        try {
            const res = await axios({
                url: getChildrenByTransport.url,
                method: getChildrenByTransport.method,
                params: data,
                withCredentials: true,
            });

            if (res.data.status === 200) {
                setChildrenTransportation(res.data.data.result);
            }
        } catch (error) {
            const id = toast.loading('Làm ơn đợi...');
            toast.error(id, {
                render: `Hiển thị thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 500,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleOpenModal = (transportItem, title) => {
        setTitleModal(title);
        toggleModal();
        setSelectedTransportation(transportItem);
    };

    const handleInputChange = (field, value) => {
        setSelectedTransportation({ ...selectedTransportation, [field]: value });
        switch (field) {
            case 'name':
                setErrors({
                    ...errors,
                    name: value ? '' : 'Tên không được để trống!',
                });
                break;
            case 'totalSeats':
                setErrors({
                    ...errors,
                    totalSeats:
                        Number.parseInt(value) >= 20 && Number.parseInt(value) <= 50
                            ? ''
                            : 'Số lượng lớn hơn 20 và bé hơn 50!',
                });
                break;
            case 'busNumber':
                setErrors({
                    ...errors,
                    busNumber:
                        value.length >= 0 && value.length <= 10 ? '' : 'Biển số xe phải lớn hơn 0 và bé hơn 10 ký tự!',
                });
                break;
            case 'availableSeats':
                setErrors({
                    ...errors,
                    availableSeats:
                        Number.parseInt(value) >= 0 && Number.parseInt(value) <= selectedTransportation.totalSeats
                            ? ''
                            : 'Chỗ trống lớn hơn 0 và bé hơn tổng số lượng!',
                });
                break;
            case 'tuition':
                setErrors({
                    ...errors,
                    tuition:
                        Number.parseInt(value) >= 500000 && Number.parseInt(value) <= 10000000
                            ? ''
                            : 'Giá tiền lớn hơn 50000 và bé hơn 10000000!',
                });
                break;
            default:
                return;
        }
    };
    const handleShowAlert = async () => {
        let data = {};
        const hasErrors = Object.values(errors).some((error) => error !== '');
        const isMissingDetail = Object.values(selectedTransportation).some((value) => value === '');
        errors.selectedOptionDriver = !selectedOptionDriver ? 'Cần chọn tài xế đảm nhiệm!!' : '';

        for (var key in errors) {
            if (errors[key]) return;
        }
        if (hasErrors || isMissingDetail) {
            toast.warning('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        data = {
            name: selectedTransportation.name,
            driverId: selectedOptionDriver,
            totalSeats: selectedTransportation.totalSeats,
            availableSeats: selectedTransportation.availableSeats,
            busNumber: selectedTransportation.busNumber,
            tuition: selectedTransportation.tuition,
            status: 'ACTIVE',
        };
        try {
            const res = await axios({
                method: updateTransportationServiceById.method,
                url: `${updateTransportationServiceById.url}/${selectedTransportation._id}`,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                toast.success(`${titleModal} thành công`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
                fetchData();
                toggleModal();
            } else if (res.data.status === 400 && res.data.message === 'Duplicate') {
                toast.warning(`Tên xe hoặc biển số xe đã tồn tại!`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            toast.error(`${titleModal} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleBack = () => {
        navigate(`/dashboards/transportation/view-list`);
    };
    const handleArrange = () => {
        navigate(`/dashboards/transportation/arrange-transportation?transportId=${transportId}`);
    };
    return (
        <div>
            <div className="flex">
                <Button text onClick={handleBack} className="text-2xl pt-0">
                    <h1 className="text-2xl font-bold mb-4 text-start text-cyan-600"> Trở về</h1>
                </Button>
                <h1 className="text-2xl font-bold mb-4 text-start">/ Quản lý các xe</h1>
            </div>
            <h1>Thông tin xe</h1>

            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-center pb-4">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="p-3">
                                        <div className="flex items-center"></div>
                                    </th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Tên xe</th>
                                    <th className="px-6 py-3">Tài xế</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Phí dịch vụ</th>
                                    <th className="px-6 py-4 cursor-pointer text-center">Ghế khả dụng</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Biển số xe</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Trạng thái</th>
                                    <th className="px-6 py-3">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    key={childTransportation._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="w-3 p-3">
                                        <div className="flex items-center"></div>
                                    </td>
                                    <td className="px-3 text-wrap text-center">{childTransportation?.name || ''}</td>
                                    <td className="px-6 py-4">
                                        {users.map((useres) => (
                                            <React.Fragment key={useres._id}>
                                                {useres._id === childTransportation?.driverId && (
                                                    <>
                                                        {useres.firstName} {useres.lastName}
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-center">{childTransportation?.tuition || ''} </td>
                                    <td className="px-6 py-4 text-center">
                                        {childTransportation.availableSeats} / {childTransportation.totalSeats}
                                    </td>
                                    <td className="px-6 py-4 text-center">{childTransportation?.busNumber || ''}</td>
                                    <td
                                        className={`px-6 py-4 text-center ${childTransportation?.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {childTransportation.status === 'ACTIVE' ? 'Đang hoạt động' : ''}
                                        {childTransportation.status === 'FULL' ? 'Đã đầy' : ''}
                                        {childTransportation.status === 'BLOCKED' ? 'Đã bị khóa' : ''}
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <>
                                            <div className="flex">
                                                <>
                                                    {childTransportation.availableSeats <=
                                                        childTransportation.totalSeats &&
                                                    childTransportation.availableSeats > 0 ? (
                                                        <>
                                                            <Button
                                                                outlineInfo
                                                                className={'mr-3'}
                                                                icon={
                                                                    <UserAdd01Icon
                                                                        size={24}
                                                                        color={'#7ED321'}
                                                                        variant={'stroke'}
                                                                        onClick={() => handleArrange()}
                                                                    />
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>

                                                <Button
                                                    outlineInfo
                                                    icon={
                                                        <PencilEdit02Icon
                                                            size={24}
                                                            color={'#223dec'}
                                                            variant={'stroke'}
                                                            onClick={() =>
                                                                handleOpenModal(childTransportation, 'Cập nhật')
                                                            }
                                                        />
                                                    }
                                                />
                                            </div>
                                        </>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h2 className="p-2">Danh sách trẻ trong xe</h2>
                    <table className="w-full  min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 text-center">STT</th>
                                <th className="px-6 py-3 ">Ảnh đại diện</th>
                                <th className="px-6 py-3 ">Họ</th>
                                <th className="px-6 py-3">Tên</th>
                                <th className="px-6 py-3 ">Tuổi</th>
                                <th className="px-6 py-3 ">Hồ sơ</th>
                                <th className="px-6 py-3">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {childTransportation.children?.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                childTransportation.children?.map((child, index) => (
                                    <tr
                                        key={child._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4 text-center">{index + 1}</td>
                                        <td className="py-4">
                                            <div className="w-30 h-20 bg-gray-100 border border-gray-300 rounded-md">
                                                {child.avatar ? (
                                                    <img
                                                        src={child.avatar}
                                                        alt="Child"
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        Không có ảnh
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-wrap">{child.firstName}</td>
                                        <td className="px-6 py-4 text-wrap">{child.lastName} </td>
                                        <td className="px-6 py-4 ">{getAge(child.dateOfBirth)}</td>
                                        <td className="px-6 py-4 ">{child.docs.length} </td>
                                        <td className="px-6 py-4 "></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Modal
                    title={`${titleModal} thông tin`}
                    _showModal={showModal}
                    onClick={toggleModal}
                    onClickAccept={handleShowAlert}
                >
                    {selectedTransportation ? (
                        <form>
                            <div className="grid gap-2">
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Tên:</p>
                                    <div className="grid">
                                        <input
                                            type="text"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedTransportation.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                        <span className=" left-0 top-full text-red-500 text-xs">{errors.name}</span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Tài xế:</p>
                                    <div className="grid w-[240px]  border border-gray-600 rounded">
                                        <SelectGroup
                                            data={driversSelect}
                                            selectedOption={selectedOptionDriver}
                                            setSelectedOption={setSelectedOptionDriver}
                                        />
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80"> Phí dịch vụ:</p>
                                    <div className="grid">
                                        <input
                                            type="number"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedTransportation.tuition}
                                            onChange={(e) => handleInputChange('tuition', e.target.value)}
                                        />
                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                            {errors.tuition}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Số lượng:</p>
                                    <div className="grid">
                                        <input
                                            type="number"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedTransportation.totalSeats}
                                            onChange={(e) => handleInputChange('totalSeats', e.target.value)}
                                        />
                                        <span className=" left-0 text-center top-full text-red-500 text-xs">
                                            {errors.totalSeats}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Còn trống:</p>
                                    <div className="grid">
                                        <input
                                            type="number"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedTransportation.availableSeats}
                                            onChange={(e) => handleInputChange('availableSeats', e.target.value)}
                                        />
                                        <span className=" left-0 text-center top-full text-red-500 text-xs">
                                            {errors.availableSeats}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Biển số xe:</p>
                                    <div className="grid">
                                        <input
                                            type="text"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedTransportation.busNumber}
                                            onChange={(e) => handleInputChange('busNumber', e.target.value)}
                                        />
                                        <span className=" left-0 text-center top-full text-red-500 text-xs">
                                            {errors.busNumber}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Trạng thái:</p>
                                    <div className="grid">
                                        <p className="mb-0 w-60 text-center pt-2">ACTIVE</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <></>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default ViewDetailTransportation;
