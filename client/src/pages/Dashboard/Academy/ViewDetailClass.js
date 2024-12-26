import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
// import Modal from '~/components/Modal';
import { getadcademy, updateAcademyById } from '~/api/academies';
import { _getUsers, findChildrenByAcademy } from '~/api/user';
import { Cancel01Icon, CheckmarkCircle02Icon, Move01Icon, PencilEdit02Icon, UserAdd01Icon } from 'hugeicons-react';
import Modal from '~/components/Modal';
import { formatDateForDateTimeLocal } from '~/utils/time';
import SelectGroup from '~/components/Selected';
import { changeClassChild, getAllCategory } from '~/api/academy';
import { getAge } from '~/utils/form';
import { conditionsAgeChildLearn } from '~/constants';
import { getRooms } from '~/api/room';
const conditions = conditionsAgeChildLearn;

function ViewDetailClass() {
    const [childAcademy, setChildrenAcademy] = useState({});
    const [academy, setAcademy] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initType = queryParams.get('type');
    const [type, setType] = useState(queryParams.get('type'));
    const academyId = queryParams.get('academyId');
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalChangeClass, setShowModalChangeClass] = useState(false);
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [titleModal, setTitleModal] = useState([]);
    const [teachersSelect, setTeachersSelect] = useState([]);
    const [selectedOptionTeacher, setSelectedOptionTeacher] = useState('');
    const [selectedOptionCondition, setSelectedOptionCondition] = useState('');
    const [categorys, setCategorys] = useState([]);
    const [categorysSelect, setCategorysSelect] = useState([]);
    const [selectedOptionCategory, setSelectedOptionCategory] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomsSelect, setRoomsSelect] = useState([]);
    const [selectedOptionRoom, setSelectedOptionRoom] = useState('');
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [errors, setErrors] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        selectedOptionTeacher: '',
        selectedOptionCondition: '',
        selectedOptionCategory: '',
        selectedOptionRoom: '',
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        if (!initType || (initType !== 'class' && initType !== 'skill')) {
            navigate(`${location.pathname}?type=class`, { replace: true });
        } else {
            setType(initType);
        }
    }, [location.search, navigate]);
    useEffect(() => {
        fetchData();
    }, [location.pathname, type, academyId]);
    useEffect(() => {
        if (selectedAcademy) {
            setSelectedOptionTeacher(selectedAcademy.teacherId);
            setSelectedOptionCondition(selectedAcademy.condition);
            setSelectedOptionRoom(selectedAcademy.room);
            if (type === 'skill') {
                setSelectedOptionCategory(selectedAcademy.category);
            }
        }
    }, [selectedAcademy]);
    useEffect(() => {
        if (categorys) {
            let _categorySelect = categorys.map((category) => ({
                value: category._id,
                title: `${category.name}`,
            }));
            setCategorysSelect(_categorySelect);
        }
    }, [categorys]);
    useEffect(() => {
        if (rooms) {
            let _roomSelect = rooms.map((room) => ({
                value: room._id,
                title: `${room.name}`,
            }));
            setRoomsSelect(_roomSelect);
        }
    }, [rooms]);
    useEffect(() => {
        if (users) {
            let _teachersSelect = users.map((user) => ({
                value: user._id,
                title: `${user.firstName} ${user.lastName}`,
            }));
            setTeachersSelect(_teachersSelect);
        }
    }, [users]);
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'TEACHER' },
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
            type: type,
            academyId: academyId,
        };
        try {
            const res = await axios({
                url: findChildrenByAcademy.url,
                method: findChildrenByAcademy.method,
                params: data,
                withCredentials: true,
            });

            if (res.data.status === 200) {
                setChildrenAcademy(res.data.data.result);
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

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                let res = await axios({
                    url: getAllCategory.url,
                    method: getAllCategory.method,
                });
                if (res.data.status === 200) {
                    setCategorys(res.data.data);
                } else {
                    let id = toast.loading('Làm ơn chờ...');
                    toast.update(id, {
                        render: `Fetch loại chủ đề  thất bại`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                }
            } catch (error) {
                let id = toast.loading('Làm ơn chờ...');
                toast.update(id, {
                    render: `Fetch loại chủ đề  thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };

        fetchCategory();
    }, []);
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                let res = await axios({
                    url: getRooms.url,
                    method: getRooms.method,
                });
                if (res.data.status === 200) {
                    setRooms(res.data.data);
                } else {
                    let id = toast.loading('Làm ơn chờ...');
                    toast.update(id, {
                        render: `Fetch phòng  thất bại`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                }
            } catch (error) {
                let id = toast.loading('Làm ơn chờ...');
                toast.update(id, {
                    render: `Fetch phòng  thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };

        fetchRoom();
    }, []);
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const toggleModalChangeClass = () => {
        setShowModalChangeClass(!showModalChangeClass);
    };
    const closeModalChangeClassOnBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            toggleModalChangeClass();
        }
    };
    const handleOpenModal = (academyItem, title) => {
        setTitleModal(title);
        toggleModal();
        setSelectedAcademy(academyItem);
    };
    const fetchDataChangeClass = async (condition) => {
        const data = {
            type: type,
            condition: { status: 'ACTIVE', condition: condition },
        };
        try {
            const res = await axios({
                method: getadcademy.method,
                url: getadcademy.url,
                params: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                const filteredResults = res.data.data.result.filter((academy) => academy._id !== childAcademy._id);
                setAcademy(filteredResults);
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

    const handleOpenModalChangeClass = (childId, condition) => {
        toggleModalChangeClass();
        fetchDataChangeClass(condition);
        setSelectedChildId(childId);
    };

    const handleChangeClassForChild = async (childId, academyId) => {
        const data = {
            type: type,
            childId: childId,
            oldAcademyId: childAcademy._id,
            newAcademyId: academyId,
        };
        try {
            const res = await axios({
                method: changeClassChild.method,
                url: changeClassChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                toast.success(`Chuyển lớp thành công`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
                fetchData();
            } else if (res.data.status === 400 && res.data.message === 'Not Found') {
                toast.warning(`Chuyển lớp xảy ra lỗi`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
            toggleModalChangeClass();
        } catch (error) {
            toast.error(`Chuyển lớp thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleInputChange = (field, value) => {
        setSelectedAcademy({ ...selectedAcademy, [field]: value });
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
            case 'availableSeats':
                setErrors({
                    ...errors,
                    availableSeats:
                        Number.parseInt(value) >= 0 && Number.parseInt(value) <= selectedAcademy.totalSeats
                            ? ''
                            : 'Chỗ trống lớn hơn 0 và bé hơn tổng số lượng!',
                });
                break;
            case 'tuition':
                setErrors({
                    ...errors,
                    tuition:
                        Number.parseInt(value) >= 50000 && Number.parseInt(value) <= 10000000
                            ? ''
                            : 'Học phí lớn hơn 50000 và bé hơn 10000000!',
                });
                break;
            case 'startTime':
                setErrors({
                    ...errors,
                    startTime:
                        new Date(value) >= new Date(new Date().toISOString().split('T')[0])
                            ? ''
                            : 'Ngày bắt đầu phải từ hôm nay trở đi!',
                });
                break;
            case 'endTime':
                setErrors({
                    ...errors,
                    endTime:
                        new Date(value) > new Date(selectedAcademy.startTime)
                            ? ''
                            : 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
                });
                break;
            default:
                return;
        }
    };
    const handleShowAlert = async () => {
        let data = {};

        if (titleModal === 'Cập nhật') {
            const hasErrors = Object.values(errors).some((error) => error !== '');
            const isMissingDetail = Object.values(selectedAcademy).some((value) => value === '');
            errors.selectedOptionTeacher = !selectedOptionTeacher ? 'Cần chọn giáo viên đảm nhiệm!!' : '';
            errors.selectedOptionCondition = !selectedOptionCondition ? 'Cần chọn điều kiện!!' : '';
            errors.selectedOptionRoom = !selectedOptionRoom ? 'Cần chọn phòng học!!' : '';
            if (type === 'skill') {
                errors.selectedOptionCategory = !selectedOptionCategory ? 'Cần chọn chủ đề!!' : '';
            }
            for (var key in errors) {
                if (errors[key]) {
                    toast.warning('Vui lòng điền đầy đủ thông tin.');
                    return;
                }
            }
            if (hasErrors || isMissingDetail) {
                toast.warning('Vui lòng điền đầy đủ thông tin.');
                return;
            }

            data = {
                type: type,
                name: selectedAcademy.name,
                teacherId: selectedOptionTeacher,
                totalSeats: selectedAcademy.totalSeats,
                availableSeats: selectedAcademy.availableSeats,
                startTime: selectedAcademy.startTime,
                endTime: selectedAcademy.endTime,
                tuition: selectedAcademy.tuition,
                condition: selectedOptionCondition,
                room: selectedOptionRoom,
                status: 'ACTIVE',
                category: selectedOptionCategory,
            };
        } else if (titleModal === 'Khóa') {
            data = {
                type: type,
                status: 'BLOCKED',
            };
        } else {
            data = {
                type: type,
                status: 'ACTIVE',
            };
        }
        try {
            const res = await axios({
                method: updateAcademyById.method,
                url: `${updateAcademyById.url}/${selectedAcademy._id}`,
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
        navigate(`/dashboards/academy/view-list?type=${type}`);
    };
    const handleArrange = () => {
        navigate(`/dashboards/academy/arrange-academy?type=${type}&academyId=${academyId}`);
    };
    return (
        <div>
            <div className="flex">
                <Button text onClick={handleBack} className="text-2xl pt-0">
                    <h1 className="text-2xl font-bold mb-4 text-start text-cyan-600"> Trở về</h1>
                </Button>
                <h1 className="text-2xl font-bold mb-4 text-start">/Quản lý các lớp</h1>
            </div>
            <h1>Thông tin lớp</h1>

            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-center pb-4">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 cursor-pointer text-center">Tên Lớp</th>
                                    <th className="px-6 py-3 text-center">Giáo viên</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Học phí</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Số lượng khả dụng</th>
                                    <th className="px-6 py-3 text-center">Phòng học</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Bắt đầu lớp</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Kết thúc lớp</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Trạng thái</th>
                                    <th className="px-6 py-3">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    key={childAcademy._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="px-6 py-4 text-center text-wrap">{childAcademy.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        {users.map((useres) => (
                                            <React.Fragment key={useres._id}>
                                                {useres._id === childAcademy.teacherId && (
                                                    <>
                                                        {useres.firstName} {useres.lastName}
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-center">{childAcademy.tuition} </td>
                                    <td className="px-6 py-4 text-center">
                                        {childAcademy.availableSeats} / {childAcademy.totalSeats}
                                    </td>
                                    <td className="px-1 py-4 text-center">
                                        {rooms.map((room) => (
                                            <React.Fragment key={room._id}>
                                                {room._id === childAcademy.room && <>{room.name}</>}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {' '}
                                        {new Date(childAcademy.startTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {' '}
                                        {new Date(childAcademy.endTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        })}
                                    </td>

                                    <td
                                        className={`px-6 py-4 text-center ${childAcademy.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {childAcademy.status === 'ACTIVE' ? 'Đang hoạt động' : ''}
                                        {childAcademy.status === 'FULL' ? (
                                            <>{new Date(childAcademy.endTime) < new Date() ? 'Hết kỳ học' : 'Đã đầy'}</>
                                        ) : (
                                            ''
                                        )}
                                        {childAcademy.status === 'BLOCKED' ? 'Đã bị khóa' : ''}
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <>
                                            <div className="flex">
                                                <>
                                                    {childAcademy.availableSeats <= childAcademy.totalSeats &&
                                                    childAcademy.availableSeats > 0 &&
                                                    childAcademy.status === 'ACTIVE' ? (
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
                                                            onClick={() => handleOpenModal(childAcademy, 'Cập nhật')}
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
                    <h2 className="p-2">Danh sách trẻ trong lớp</h2>
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
                            {childAcademy.children?.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                childAcademy.children?.map((child, index) => (
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
                                                    <img
                                                        src="/img/default-avt.png"
                                                        alt="User Avt"
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-wrap">{child.firstName}</td>
                                        <td className="px-6 py-4 text-wrap">{child.lastName} </td>
                                        <td className="px-6 py-4 ">{getAge(child.dateOfBirth)}</td>
                                        <td className="px-6 py-4 ">{child.docs.length} </td>
                                        <td className="px-6 py-4 ">
                                            <div className="flex">
                                                <Button
                                                    outlineInfo
                                                    icon={
                                                        <Move01Icon
                                                            size={24}
                                                            color={'#e61010'}
                                                            variant={'stroke'}
                                                            onClick={() =>
                                                                handleOpenModalChangeClass(
                                                                    child._id,
                                                                    getAge(child.dateOfBirth),
                                                                )
                                                            }
                                                        />
                                                    }
                                                />
                                            </div>
                                        </td>
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
                    {titleModal === 'Mở khóa' ? (
                        <>
                            <div>
                                <div className="w-full justify-center  flex">
                                    <h1 className="text-center  ">Bạn có muốn mở khóa lớp {selectedAcademy.name}</h1>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {' '}
                            {titleModal === 'Khóa' ? (
                                <div>
                                    <div className="w-full justify-center  flex">
                                        <h1 className="text-center  ">Bạn có muốn khóa lớp {selectedAcademy.name}</h1>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {selectedAcademy ? (
                                        <form>
                                            <div className="grid gap-1">
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Tên:</p>
                                                    <div className="grid">
                                                        <input
                                                            type="text"
                                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                                            value={selectedAcademy.name}
                                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                                        />
                                                        <span className=" left-0 top-full text-red-500 text-xs">
                                                            {errors.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex mb-2">
                                                    <p className="mb-0 pt-2 w-80">Giáo viên:</p>
                                                    <div className="grid w-[240px]  border border-gray-600 rounded">
                                                        <SelectGroup
                                                            data={teachersSelect}
                                                            selectedOption={selectedOptionTeacher}
                                                            setSelectedOption={setSelectedOptionTeacher}
                                                        />
                                                    </div>
                                                </div>
                                                {type === 'skill' ? (
                                                    <div className="flex">
                                                        <p className="mb-0 pt-2 w-80">Chủ đề kỹ năng:</p>
                                                        <div className="grid w-[240px]  border border-gray-600 rounded">
                                                            <SelectGroup
                                                                data={categorysSelect}
                                                                selectedOption={selectedOptionCategory}
                                                                setSelectedOption={setSelectedOptionCategory}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Số tuổi học :</p>
                                                    <div className="grid w-[240px] border border-gray-600 rounded">
                                                        <SelectGroup
                                                            data={conditions}
                                                            selectedOption={selectedOptionCondition}
                                                            setSelectedOption={setSelectedOptionCondition}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Học phí:</p>
                                                    <div className="grid">
                                                        <input
                                                            type="number"
                                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                                            value={selectedAcademy.tuition}
                                                            onChange={(e) =>
                                                                handleInputChange('tuition', e.target.value)
                                                            }
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
                                                            value={selectedAcademy.totalSeats}
                                                            onChange={(e) =>
                                                                handleInputChange('totalSeats', e.target.value)
                                                            }
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
                                                            value={selectedAcademy.availableSeats}
                                                            onChange={(e) =>
                                                                handleInputChange('availableSeats', e.target.value)
                                                            }
                                                        />
                                                        <span className=" left-0 text-center top-full text-red-500 text-xs">
                                                            {errors.availableSeats}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Phòng học :</p>
                                                    <div className="grid w-[240px] border border-gray-600 rounded">
                                                        <SelectGroup
                                                            data={roomsSelect}
                                                            selectedOption={selectedOptionRoom}
                                                            setSelectedOption={setSelectedOptionRoom}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Bắt đầu lớp:</p>
                                                    <div className="grid">
                                                        <input
                                                            type="datetime-local"
                                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                                            value={formatDateForDateTimeLocal(
                                                                new Date(selectedAcademy.startTime),
                                                            )}
                                                            onChange={(e) =>
                                                                handleInputChange('startTime', e.target.value)
                                                            }
                                                        />
                                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                                            {errors.startTime}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <p className="mb-0 pt-2 w-80">Kêt thúc lớp:</p>
                                                    <div className="grid">
                                                        <input
                                                            type="datetime-local"
                                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                                            value={formatDateForDateTimeLocal(
                                                                new Date(selectedAcademy.endTime),
                                                            )}
                                                            onChange={(e) =>
                                                                handleInputChange('endTime', e.target.value)
                                                            }
                                                        />
                                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                                            {errors.endTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Modal>
                {showModalChangeClass && (
                    <div
                        id="default-modal"
                        tabIndex="-1"
                        aria-hidden="true"
                        onClick={closeModalChangeClassOnBackdropClick}
                        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden"
                    >
                        <div className="relative mt-20 p-4 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[90vh]">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Chuyển lớp cho trẻ
                                    </h3>
                                    <Button
                                        primary
                                        icon={<Cancel01Icon />}
                                        small
                                        onClick={toggleModalChangeClass}
                                        className="rounded-md bg-red-500"
                                    ></Button>
                                </div>
                                <div className=" flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-center pb-4">
                                    <div className="overflow-y-auto max-h-100">
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th className="p-3">
                                                        <div className="flex items-center"></div>
                                                    </th>
                                                    <th className="px-6 py-3 cursor-pointer">Tên Lớp</th>
                                                    <th className="px-6 py-3">Giáo viên</th>
                                                    <th className="px-6 py-3 cursor-pointer">Học phí</th>
                                                    <th className="px-6 py-3 cursor-pointer">Số lượng khả dụng</th>
                                                    <th className="px-6 py-3 cursor-pointer">Phòng học</th>
                                                    <th className="px-6 py-3 cursor-pointer">Trạng thái</th>
                                                    <th className="px-6 py-3">Chức năng</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {academy.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center ">
                                                            <div className="w-full justify-center  flex">
                                                                <h1 className="text-center  ">Danh sách rỗng</h1>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    academy.map((academies) => (
                                                        <tr
                                                            key={academies._id}
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                        >
                                                            <td className="w-3 p-3">
                                                                <div className="flex items-center"></div>
                                                            </td>
                                                            <td className="px-3 py-4  text-wrap">{academies.name}</td>
                                                            <td className="px-6 py-4">
                                                                {users.map((useres) => (
                                                                    <React.Fragment key={useres._id}>
                                                                        {useres._id === academies.teacherId && (
                                                                            <>
                                                                                {useres.firstName} {useres.lastName}
                                                                            </>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </td>
                                                            <td className="px-6 py-4 ">{academies.tuition} </td>
                                                            <td className="px-6 py-4 ">
                                                                {academies.availableSeats} / {academies.totalSeats}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {rooms.map((room) => (
                                                                    <React.Fragment key={room._id}>
                                                                        {room._id === academies.room && (
                                                                            <>{room.name}</>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </td>
                                                            <td className="px-6 py-4 ">{academies.status} </td>
                                                            <td className="px-6 py-4 ">
                                                                <div className="flex items-center justify-center">
                                                                    <Button
                                                                        outlineInfo
                                                                        className={'mr-3'}
                                                                        icon={
                                                                            <CheckmarkCircle02Icon
                                                                                size={24}
                                                                                color={'#7ED321'}
                                                                                variant={'stroke'}
                                                                                onClick={() =>
                                                                                    handleChangeClassForChild(
                                                                                        selectedChildId,
                                                                                        academies._id,
                                                                                    )
                                                                                }
                                                                            />
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewDetailClass;
