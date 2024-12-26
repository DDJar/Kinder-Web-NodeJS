import React, { useState, useEffect } from 'react';
import AcademyHeader from './header';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { getSkill } from '~/api/academies';
import useDebounce from '~/utils/useDebounce';
import { getChildren } from '~/api/user';
import { useNavigate } from 'react-router-dom';
import { getAllCategory, registerSkill } from '~/api/academy';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import SelectGroup from '~/components/Selected';
const Skilles = () => {
    const { user } = useUserProvider();
    const [skilles, setSkilles] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedOptionCategory, setSelectedOptionCategory] = useState('');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce(search.trim(), 500);
    const [sortCriteria, setSortCriteria] = useState('all');
    const [children, setChildren] = useState([]);
    const [formData, setFormData] = useState({
        idChild: '',
        idSkill: '',
        name: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {};
                if (debouncedValue) {
                    params.name = debouncedValue;
                }
                if (sortCriteria !== 'all') {
                    params.condition = sortCriteria;
                }
                if (selectedOptionCategory !== '') {
                    params.category = selectedOptionCategory;
                }
                const res = await axios({
                    method: getSkill.method,
                    url: getSkill.url,
                    params: params,
                    withCredentials: true,
                });
                if (res.data.status === 200) {
                    const skillesWithDates = res.data.data.map((skillesItem) => ({
                        ...skillesItem,
                        startTime: new Date(skillesItem.startTime),
                        endTime: new Date(skillesItem.endTime),
                    }));
                    setSkilles(skillesWithDates);
                    toast.success('Hiển thị thành công', {
                        autoClose: 1000,
                        closeOnClick: true,
                    });
                } else {
                    console.error('error');
                }
            } catch (error) {
                toast.error(`Hiển thị thất bại`, {
                    render: `${error.message}`,
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        };
        fetchData();
    }, [debouncedValue, sortCriteria, user, selectedOptionCategory]);

    useEffect(() => {
        if (categorys) {
            let _categorySelect = categorys.map((category) => ({
                value: category._id,
                title: `${category.name}`,
            }));
            setSelectedCategory(_categorySelect);
        }
    }, [categorys]);
    useEffect(() => {
        const fetchAllCategory = async () => {
            try {
                let res = await axios({
                    url: getAllCategory.url,
                    method: getAllCategory.method,
                });
                if (res.data.status === 200) {
                    setCategorys(res.data.data);
                }
            } catch (error) {
                toast.error(`Hiển thị thất bại`, {
                    render: `${error.message}`,
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        };
        fetchAllCategory();
    }, []);
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleSubmitRegister = async () => {
        if (formData.idChild) {
            try {
                const res = await axios({
                    method: registerSkill.method,
                    url: registerSkill.url,
                    data: {
                        idChild: formData.idChild,
                        idSkill: formData.idSkill,
                        name: formData.name,
                    },
                });
                if (res.data.status === 200) {
                    setFormData({ idSkill: '', idChild: '' });
                    toast.success('Đăng ký thành công', {
                        autoClose: 1000,
                        closeOnClick: true,
                    });
                }
            } catch (error) {
                toast.error(`Hiển thị thất bại`, {
                    render: `${error.message}`,
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        } else {
            toast.warning(`Không có trẻ để đăng ký`, {
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };

    const handleJoinSkilles = async (skillesItem) => {
        try {
            if (!user) {
                navigate(`/login`);
            } else {
                const res = await axios({
                    method: getChildren.method,
                    url: getChildren.url,
                    params: { userId: user._id },
                });
                if (res.data.status === 200) {
                    const filteredChildren = res.data.data.children.filter((child) => {
                        const childAge = currentYear - new Date(child.dateOfBirth).getFullYear();
                        const hasActiveClass = child.class.some((classItem) => classItem.status === 'ACTIVE');
                        const hasActiveClassThisMonth = child.class.some((classItem) => {
                            const classCreatedAt = new Date(classItem.createdAt);
                            return (
                                classItem.status === 'ACTIVE' &&
                                classCreatedAt.getFullYear() === currentYear &&
                                classCreatedAt.getMonth() === currentMonth
                            );
                        });

                        return (
                            childAge === parseInt(skillesItem.condition) &&
                            !child.skill.some((skilles) => skilles.skillId.toString() === skillesItem._id) &&
                            (hasActiveClass || hasActiveClassThisMonth)
                        );
                    });
                    setChildren(filteredChildren);
                    toast.success('Hiển thị thành công', {
                        autoClose: 1000,
                        closeOnClick: true,
                    });
                } else {
                    console.error(res);
                }
                toggleModal();
                setSelectedClass(skillesItem);
                setFormData({ ...formData, idSkill: skillesItem._id, name: skillesItem.name });
            }
        } catch (error) {
            console.error(error);
            toast.error(`Hiển thị thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleSortChange = (sortOption) => {
        setSortCriteria(sortOption);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFormSubmit = () => {
        handleSubmitRegister();
        toggleModal();
    };
    return (
        <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <AcademyHeader
                    sortCriteria={sortCriteria}
                    search={search}
                    onSortChange={handleSortChange}
                    onSearchChange={handleSearchChange}
                />
                <div className="flex ">
                    <SelectGroup
                        data={selectedCategory}
                        selectedOption={selectedOptionCategory}
                        setSelectedOption={setSelectedOptionCategory}
                    />
                </div>
                <div className="container mt-3">
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                            <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900">
                                Danh sách lớp học kỹ năng
                            </h2>

                            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-3 xl:gap-x-8">
                                {skilles.length == 0 ? (
                                    <div className="w-full justify-center col-span-5 mt-6">
                                        <h1 className="text-center  ">Danh sách rỗng</h1>
                                    </div>
                                ) : (
                                    <>
                                        {skilles.map((skillItem) => (
                                            <div className="group relative border" key={skillItem._id}>
                                                <div className="relative">
                                                    <span className="bg-red-700 text-white right-0 absolute">
                                                        {skillItem.endTime < new Date() ? (
                                                            <>Hết hạn</>
                                                        ) : (
                                                            skillItem.availableSeats <= 0 && <>Đầy</>
                                                        )}
                                                    </span>

                                                    <img className="w-full" src="img/class-2.jpg" alt="Skill" />
                                                </div>

                                                <div className="px-6 py-4 flex justify-center">
                                                    <div className="font-bold text-xl mb-2"> {skillItem.name}</div>
                                                </div>
                                                <div className="px-6 py-4">
                                                    <div className="text-gray-700 text-base">
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1  text-sm text-left border-r">
                                                                <strong>Tuổi học:</strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.condition}
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1 text-sm text-left border-r">
                                                                <strong>Chủ đề của lớp:</strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.category?.name
                                                                    ? skillItem.category.name
                                                                    : 'chưa có'}
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1 text-sm text-left border-r">
                                                                <strong>Số lượng của lớp:</strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.availableSeats} / {skillItem.totalSeats}
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1  text-sm text-left border-r">
                                                                <strong>Bắt đầu mở lớp :</strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.startTime.toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1  text-sm text-left border-r">
                                                                <strong>Kết thúc mở lớp : </strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.endTime.toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="flex border-b">
                                                            <div className="w-1/2 py-1  text-sm text-left border-r">
                                                                <strong>Giá tiền:</strong>
                                                            </div>
                                                            <div className="w-1/2 py-1  text-sm text-center">
                                                                {skillItem.tuition}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-4 flex justify-center">
                                                    {skillItem.availableSeats >= 0 &&
                                                        skillItem.endTime > new Date() && (
                                                            <Button
                                                                secondary
                                                                onClick={() => handleJoinSkilles(skillItem)}
                                                            >
                                                                Đăng ký
                                                            </Button>
                                                        )}
                                                    {(skillItem.availableSeats <= 0 ||
                                                        skillItem.endTime < new Date()) && (
                                                        <Button error disable roundedMd>
                                                            Hết đăng ký
                                                        </Button>
                                                    )}
                                                </div>
                                                {selectedClass === skillItem && (
                                                    <Modal
                                                        title={'Xác nhận đăng ký'}
                                                        _showModal={showModal}
                                                        onClick={toggleModal}
                                                        onClickAccept={handleFormSubmit}
                                                    >
                                                        <form>
                                                            <div>
                                                                <div className="flex">
                                                                    <p className="mb-0 w-80 pt-2">Tên phụ huynh:</p>
                                                                    <input
                                                                        type="hidden"
                                                                        name="idUser"
                                                                        value={user._id}
                                                                    />
                                                                    <p className="mb-0 pt-2 w-60 text-center">
                                                                        {user.firstName} {user.lastName}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80 mr-4">
                                                                        Tên trẻ đăng ký:
                                                                    </p>
                                                                    <select
                                                                        className="w-60  text-center"
                                                                        name="idChild"
                                                                        value={formData.idChild}
                                                                        onChange={(e) =>
                                                                            setFormData({
                                                                                ...formData,
                                                                                idChild: e.target.value,
                                                                            })
                                                                        }
                                                                    >
                                                                        <option className="text-center" value="">
                                                                            Chọn trẻ phù hợp
                                                                        </option>
                                                                        {children.length > 0 ? (
                                                                            children.map((child) => (
                                                                                <>
                                                                                    <option
                                                                                        className="text-center"
                                                                                        key={child._id}
                                                                                        value={child._id}
                                                                                    >
                                                                                        {child.firstName}{' '}
                                                                                        {child.lastName}
                                                                                    </option>
                                                                                </>
                                                                            ))
                                                                        ) : (
                                                                            <option className="text-center" value="">
                                                                                Không có trẻ phù hợp
                                                                            </option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Lớp:</p>
                                                                    <p className="mb-0 w-60 text-center pt-2">
                                                                        {skillItem.name}
                                                                    </p>
                                                                </div>

                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Chủ đề của lớp:</p>
                                                                    <p className="w-60 mb-0 pt-2 text-center">
                                                                        {skillItem.category.name}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Số lượng của lớp:</p>
                                                                    <p className="w-60 mb-0 pt-2 text-center">
                                                                        {skillItem.availableSeats} /{' '}
                                                                        {skillItem.totalSeats}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Ngày bắt đầu học:</p>
                                                                    <p className="mb-0 w-60 text-center pt-2">
                                                                        {skillItem.startTime.toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                year: 'numeric',
                                                                                month: '2-digit',
                                                                                day: '2-digit',
                                                                            },
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Ngày kết thúc học:</p>
                                                                    <p className="mb-0 w-60 text-center pt-2">
                                                                        {skillItem.endTime.toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                        })}
                                                                    </p>
                                                                </div>
                                                                <div className="flex">
                                                                    <p className="mb-0 pt-2 w-80">Học phí:</p>
                                                                    <p className=" mb-0 w-60 text-center pt-2">
                                                                        {skillItem.tuition}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Modal>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Skilles;
