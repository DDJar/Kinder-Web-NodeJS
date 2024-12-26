import SelectGroup from '~/components/Selected';
import Button from '~/components/Button';
import { validateInputRequire, validateRange } from '~/utils/validate';
import { useState } from 'react';
import { RemoveCircleIcon } from 'hugeicons-react';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import { createCurriculumApi } from '~/api/curriculum';
import { conditionsAgeChildLearn } from '~/constants';

const conditions = conditionsAgeChildLearn;
const CreateCurriculum = () => {
    const [selectedOptionCondition, setSelectedOptionCondition] = useState();
    const [dataInput, setDataInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        selectedOptionCondition,
        durationOfStudy: '',
        skills: [
            // { _id: 12123123, name: 'nhay' },
            // { _id: 1122123123, name: 'mua' },
        ],
    });
    const [errInput, setErrInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        selectedOptionCondition: '',
        durationOfStudy: '',
    });
    const toastOptions = {
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        closeButton: true,
    };
    const handleChange = (_name, _value) => {
        var err = '';

        switch (_name) {
            case 'name':
                err = validateInputRequire(_value, 2, 100);
                break;
            case 'totalSeats':
                err = validateRange(_value, 20, 50);
                break;
            case 'tuition':
                err = validateRange(_value, 400, 10000000);
                break;
            case 'durationOfStudy':
                err = validateRange(_value, 1, 24);
                break;
            default:
                return;
        }
        setDataInput((prev) => ({ ...prev, [_name]: _value }));
        setErrInput((prev) => ({ ...prev, [_name]: err }));
    };
    const handleSubmit = async () => {
        handleChange('name', dataInput.name);
        handleChange('totalSeats', dataInput.totalSeats);
        handleChange('tuition', dataInput.tuition);
        handleChange('durationOfStudy', dataInput.durationOfStudy);
        dataInput.selectedOptionCondition = selectedOptionCondition;
        dataInput.condition = selectedOptionCondition;
        errInput.selectedOptionCondition = !selectedOptionCondition ? 'Cần chọn điều kiện!!' : '';
        for (var key in errInput) {
            if (errInput[key]) return;
        }

        const id = toast.loading('Dang tao...');
        try {
            const res = await axios({
                method: createCurriculumApi.method,
                url: createCurriculumApi.url,
                data: dataInput,
            });
            console.log(res.data.status == 200);

            if (res.data.status == 200) {
                toast.update(id, {
                    ...toastOptions,
                    render: 'Tạo chương trình học thành công',
                    type: 'success',
                });
            } else if (res.data.status == 409) {
                toast.update(id, {
                    ...toastOptions,
                    render: 'Tên chương trình học đã tồn tại',
                    type: 'error',
                });
            } else {
                toast.update(id, {
                    ...toastOptions,
                    render: 'Tạo chương trình học không thành công',
                    type: 'error',
                });
            }
        } catch (error) {
            toast.update(id, {
                ...toastOptions,
                render: `Tao thất bại!`,
                type: 'error',
            });
        }
    };
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="">
                            <label className="mb-2.5 block text-black " htmlFor="name">
                                Tên chương trình học
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={dataInput.name}
                                onChange={(e) => handleChange(e.target.id, e.target.value)}
                                placeholder={`Nhập tên chuong trinh`}
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
                        <div className="">
                            <label className="mb-2.5 block text-black " htmlFor="durationOfStudy">
                                Thời gian học (đơn vị tháng)
                            </label>
                            <input
                                type="number"
                                id="durationOfStudy"
                                placeholder="Nhập thoi gian hoc"
                                value={dataInput.durationOfStudy}
                                onChange={(e) => handleChange(e.target.id, e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                            />
                            <span className="text-error text-xs ml-5">{errInput.durationOfStudy}</span>
                        </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row hidden">
                        <div className="">
                            <label className="mb-2.5 block text-black " htmlFor="totalSeats">
                                Cac mon ki nang them:
                                {dataInput.skills?.map((item, index) => (
                                    <span key={index}>
                                        <RemoveCircleIcon /> {item.name} ,{' '}
                                    </span>
                                ))}
                            </label>
                            <input
                                type="text"
                                id="totalSeats"
                                placeholder="Nhập số lượng"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                            />
                        </div>
                    </div>

                    <Button primary large roundedMd onClick={handleSubmit}>
                        Tạo chương trình học
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateCurriculum;
