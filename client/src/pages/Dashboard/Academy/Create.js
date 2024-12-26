import axios from '~/config/configAxios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { _createAcademy, getAllCategory } from '~/api/academy';
import { getRooms } from '~/api/room';
import Button from '~/components/Button';
import SelectGroup from '~/components/Selected';
import { getCurrentDateMonthYear, plusMonth } from '~/utils/time';
import { validateInputRequire, validateRange } from '~/utils/validate';
import { _getUsers } from '~/api/user';
import { getAllCurriculumApi } from '~/api/curriculum';
import { conditionsAgeChildLearn } from '~/constants';

const conditions = conditionsAgeChildLearn;

function CreateAcademy() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const [selectedOptionTeacher, setSelectedOptionTeacher] = useState('');
    const [selectedOptionCategory, setSelectedOptionCategory] = useState('');
    const [selectedOptionCondition, setSelectedOptionCondition] = useState('');
    const [selectedCurriculum, setSelectedCurriculum] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [conditionCurriculum, setConditionCurriculum] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const initType = queryParams.get('type');
    const [type, setType] = useState(queryParams.get('type'));
    const [teachersSelect, setTeachersSelect] = useState([]);
    const [categorysSelect, setCategorysSelect] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [recommentCurriculum, setRecommentCurriculum] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [curriculums, setCurriculums] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [roomSelect, setRoomSelect] = useState([]);
    const [dataInput, setDataInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        selectedOptionTeacher,
        selectedOptionCondition,
        startDate: getCurrentDateMonthYear(),
        endDate: plusMonth(getCurrentDateMonthYear(), 12),
    });
    const [errInput, setErrInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        selectedOptionTeacher: '',
        selectedOptionCondition: '',
        selectedOptionCategory: '',
        startDate: '',
        endDate: '',
        selectedRoom: '',
    });
    useEffect(() => {
        if (teachers) {
            let _teachersSelect = teachers.map((user) => ({
                value: user._id,
                title: `${user.firstName} ${user.lastName}`,
            }));
            setTeachersSelect(_teachersSelect);
        }
    }, [teachers]);
    useEffect(() => {
        if (rooms) {
            setRoomSelect(rooms.map((room) => ({ value: room._id, title: room.name })));
        }
    }, [rooms]);
    useEffect(() => {
        const fetchCurriculum = async () => {
            const res = await axios({
                url: getAllCurriculumApi.url,
                method: getAllCurriculumApi.method,
            });

            if (res.data.status == 200) {
                setCurriculums(res.data.data);
                let tempSelectCurriculum = [];
                if (res.data.data.length > 0) {
                    res.data.data.map((curr) => {
                        tempSelectCurriculum.push({
                            value: curr._id,
                            title: curr.name,
                        });
                    });
                }
                setConditionCurriculum(tempSelectCurriculum);
            }
        };
        if (type === 'class') {
            fetchCurriculum();
        } else {
            setRecommentCurriculum({});
        }
    }, [type]);
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
        if (!initType || (initType !== 'class' && initType !== 'skill')) {
            navigate(`${location.pathname}?type=class`, { replace: true });
        } else {
            setType(initType);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'TEACHER' },
                });
                if (res.data.status === 200) {
                    setTeachers(res.data.data.users);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchTeachers();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                let res = await axios({
                    url: getRooms.url,
                    method: getRooms.method,
                });
                if (res.data.status === 200) {
                    setRooms(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRooms();
    }, []);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                let res = await axios({
                    url: getAllCategory.url,
                    method: getAllCategory.method,
                });
                if (res.data.status === 200) {
                    setCategorys(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategory();
    }, []);
    const handleSetSelectedCurriculum = (_value) => {
        setSelectedCurriculum(_value);
        let tempSelect = curriculums?.find((curr) => curr._id === _value);
        if (!tempSelect) {
            return;
        }
        setRecommentCurriculum(tempSelect);
        if (!selectedOptionCondition) {
            setSelectedOptionCondition(tempSelect?.condition);
            setDataInput((prevState) => ({
                name: prevState.name,
                totalSeats: prevState.totalSeats || tempSelect?.totalSeats || '',
                tuition: prevState.tuition || tempSelect?.tuition || '',
                selectedOptionTeacher: prevState.selectedOptionTeacher || '',
                selectedOptionCondition: prevState.selectedOptionCondition || tempSelect?.condition,
                startDate: prevState.startDate,
                endDate: plusMonth(prevState.startDate, tempSelect?.durationOfStudy || 12),
            }));
        }
    };
    const handleChange = (_name, _value) => {
        var err = '';
        switch (_name) {
            case 'name':
                err = validateInputRequire(_value, 5, 100);
                break;
            case 'totalSeats':
                err = validateRange(_value, 20, 50);
                break;
            case 'tuition':
                err = validateRange(_value, 400, 10000000);
                break;
            case 'startDate':
                err = validateRange(
                    _value,
                    getCurrentDateMonthYear(),
                    plusMonth(getCurrentDateMonthYear(), recommentCurriculum?.durationOfStudy || 12),
                );
                break;
            case 'endDate':
                err = validateRange(
                    _value,
                    plusMonth(dataInput.startDate, recommentCurriculum?.durationOfStudy || 12),
                    plusMonth(dataInput.startDate, recommentCurriculum?.durationOfStudy + 1 || 24),
                );
                break;
            default:
                return;
        }
        setDataInput((prev) => ({ ...prev, [_name]: _value }));
        setErrInput((prev) => ({ ...prev, [_name]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleChange('name', dataInput.name);
        handleChange('totalSeats', dataInput.totalSeats);
        handleChange('tuition', dataInput.tuition);
        handleChange('startDate', dataInput.startDate);
        handleChange('endDate', dataInput.endDate);
        errInput.selectedOptionTeacher = !selectedOptionTeacher ? 'Cần chọn giáo viên đảm nhiệm!!' : '';
        errInput.selectedRoom = !selectedRoom ? 'Cần phòng học để tạo lớp!!' : '';
        errInput.selectedOptionCondition = !selectedOptionCondition ? 'Cần chọn điều kiện!!' : '';
        if (type == 'skill') {
            errInput.selectedOptionCategory = !selectedOptionCategory ? 'Cần chọn chủ đề!!' : '';
        }
        for (var key in errInput) {
            if (errInput[key]) return;
        }
        const id = toast.loading('Lam on cho...');
        const _data = {
            type: type,
            name: dataInput.name,
            teacherId: selectedOptionTeacher,
            totalSeats: dataInput.totalSeats,
            startTime: dataInput.startDate,
            endTime: dataInput.endDate,
            tuition: dataInput.tuition,
            condition: selectedOptionCondition,
            category: selectedOptionCategory,
            room: selectedRoom,
        };
        try {
            const res = await axios({
                method: _createAcademy.method,
                url: _createAcademy.url,
                data: _data,
            });
            if (res.data.status === 200) {
                toast.update(id, {
                    render: 'Tạo thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            } else {
                toast.update(id, {
                    render: `Tạo thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        } catch (error) {
            toast.update(id, {
                render: `Đăng nhập thất bại ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };

    return (
        <div className="">
            <div className="flex space-x-4 mb-4">
                <Button
                    outlinePrimary={type !== 'class'}
                    primary={type === 'class'}
                    to={`${location.pathname}?type=class`}
                    roundedMd
                    target="_self"
                >
                    Lớp học
                </Button>
                <Button
                    outlinePrimary={type !== 'skill'}
                    primary={type === 'skill'}
                    to={`${location.pathname}?type=skill`}
                    roundedMd
                    target="_self"
                >
                    Lớp kĩ năng
                </Button>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <form action="#" onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            {type == 'class' && (
                                <div className="">
                                    <label className="mb-2.5 block text-black " htmlFor="role">
                                        Chương trình học
                                    </label>
                                    <SelectGroup
                                        data={conditionCurriculum}
                                        selectedOption={selectedCurriculum}
                                        setSelectedOption={handleSetSelectedCurriculum}
                                    />
                                    <span className="text-error text-xs ml-5">{errInput.selectedOptionCondition}</span>
                                </div>
                            )}
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="name">
                                    {`Tên ${type === 'class' ? 'lớp học' : 'kĩ năng'}`}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={dataInput.name}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    placeholder={`Nhập tên ${type === 'class' ? 'lớp học' : 'kĩ năng'}`}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.name}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="totalSeats">
                                    Số lượng trẻ
                                </label>
                                <input
                                    type="number"
                                    id="totalSeats"
                                    placeholder="Nhập số lượng"
                                    value={dataInput.totalSeats}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.totalSeats}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="tuition">
                                    Học phí(vnđ/tháng)
                                </label>
                                <input
                                    type="number"
                                    id="tuition"
                                    placeholder="Nhập học phí vnđ"
                                    value={dataInput.tuition}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.tuition}</span>
                            </div>
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="h-auto">
                                <label className="mb-2.5 block text-black " htmlFor="role">
                                    Giáo viên đảm nhiệm
                                </label>
                                <SelectGroup
                                    data={teachersSelect}
                                    selectedOption={selectedOptionTeacher}
                                    setSelectedOption={setSelectedOptionTeacher}
                                />
                                <span className="text-error text-xs ml-5">{errInput.selectedOptionTeacher}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="role">
                                    Số tuổi học
                                </label>
                                <SelectGroup
                                    data={conditions}
                                    selectedOption={selectedOptionCondition}
                                    setSelectedOption={setSelectedOptionCondition}
                                />
                                <span className="text-error text-xs ml-5">{errInput.selectedOptionCondition}</span>
                            </div>
                            {type === 'skill' ? (
                                <div className="h-auto">
                                    <label className="mb-2.5 block text-black " htmlFor="role">
                                        Chủ đề kỹ năng
                                    </label>
                                    <SelectGroup
                                        data={categorysSelect}
                                        selectedOption={selectedOptionCategory}
                                        setSelectedOption={setSelectedOptionCategory}
                                    />
                                    <span className="text-error text-xs ml-5">{errInput.selectedOptionCategory}</span>
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="startDate">
                                    Ngày bắt đầu học
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={dataInput.startDate}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.startDate}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="endDate">
                                    Ngày kết thúc học
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={dataInput.endDate}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.endDate}</span>
                            </div>
                            <div className="h-auto">
                                <label className="mb-2.5 block text-black " htmlFor="role">
                                    Phòng học
                                </label>
                                <SelectGroup
                                    data={roomSelect}
                                    selectedOption={selectedRoom}
                                    setSelectedOption={setSelectedRoom}
                                />
                                <span className="text-error text-xs ml-5">{errInput.selectedRoom}</span>
                            </div>
                        </div>
                        <Button primary large roundedMd>{`Tạo ${type === 'class' ? 'lớp học' : 'kĩ năng'}`}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAcademy;
