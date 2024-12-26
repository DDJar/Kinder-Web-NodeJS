import axios from '~/config/configAxios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { _getUsers } from '~/api/user';
import Button from '~/components/Button';
import SelectGroup from '~/components/Selected';
import { validateInputRequire, validateRange } from '~/utils/validate';
import { createTransportationService } from '~/api/transportation';

function CreateTransportation() {
    const [drivers, setDrivers] = useState([]);
    const [driversSelect, setDriversSelect] = useState([]);
    const [selectedOptionDriver, setSelectedOptionDriver] = useState('');
    const [dataInput, setDataInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        busNumber: '',
    });
    const [errInput, setErrInput] = useState({
        name: '',
        totalSeats: '',
        tuition: '',
        busNumber: '',
        selectedOptionDriver: '',
    });

    useEffect(() => {
        if (drivers) {
            let _driverSelect = drivers.map((driver) => ({
                value: driver._id,
                title: `${driver.firstName} ${driver.lastName}`,
            }));
            setDriversSelect(_driverSelect);
        }
    }, [drivers]);
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'DRIVER' },
                });
                if (res.data.status === 200) {
                    setDrivers(res.data.data.users);
                }
            } catch (error) {
                let id = toast.loading('Làm ơn chờ...');
                toast.update(id, {
                    render: `Fetch tài xế thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };

        fetchDrivers();
    }, []);
    const handleChange = (_name, _value) => {
        var err = '';

        switch (_name) {
            case 'name':
                err = validateInputRequire(_value, 5, 100);
                break;
            case 'totalSeats':
                err = validateRange(_value, 16, 30);
                break;
            case 'tuition':
                err = validateRange(_value, 500, 10000000);
                break;
            case 'busNumber':
                err = validateInputRequire(_value, 5, 10);
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
        handleChange('busNumber', dataInput.busNumber);
        errInput.selectedOptionDriver = !selectedOptionDriver ? 'Cần chọn tài xế đảm nhiệm!!' : '';
        if (!dataInput.name || !dataInput.totalSeats || !dataInput.tuition || !dataInput.busNumber) {
            toast.warning('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        for (var key in errInput) {
            if (errInput[key]) {
                toast.warning('Vui lòng điền đầy đủ thông tin.');
                return;
            }
        }
        const id = toast.loading('Please wait...');
        const _data = {
            name: dataInput.name,
            driverId: selectedOptionDriver,
            totalSeats: dataInput.totalSeats,
            busNumber: dataInput.busNumber,
            tuition: dataInput.tuition,
        };
        try {
            const res = await axios({
                method: createTransportationService.method,
                url: createTransportationService.url,
                data: _data,
                withCredentials: true,
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
            } else if (res.data.status === 400 && res.data.message === 'Valid is required') {
                toast.update(id, {
                    render: `Dữ liệu không hợp lệ`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            } else if (res.data.status === 400 && res.data.message === 'Duplicate') {
                toast.update(id, {
                    render: `Tên xe hoặc biển số xe đã tồn tại!`,
                    type: 'warning',
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
                render: `Tạo thất bại ${error.message}`,
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
                <h1>Tạo xe đưa đón</h1>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <form action="#" onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-24 xl:flex-row">
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="name">
                                    Tên xe
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nhập tên xe"
                                    value={dataInput.name}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs">{errInput.name}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="role">
                                    Tài xế đảm nhiệm
                                </label>
                                <SelectGroup
                                    data={driversSelect}
                                    selectedOption={selectedOptionDriver}
                                    setSelectedOption={setSelectedOptionDriver}
                                />
                                <span className="text-error text-xs ml-5">{errInput.selectedOptionDriver}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="totalSeats">
                                    Số lượng ghế
                                </label>
                                <input
                                    type="number"
                                    id="totalSeats"
                                    placeholder="Nhập số lượng"
                                    value={dataInput.totalSeats}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs">{errInput.totalSeats}</span>
                            </div>
                        </div>
                        <div className="mb-4.5 flex flex-col gap-24 xl:flex-row">
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="tuition">
                                    Phí dịch vụ(vnđ/tháng)
                                </label>
                                <input
                                    type="number"
                                    id="tuition"
                                    placeholder="Nhập phí dịch vụ vnđ"
                                    value={dataInput.tuition}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs">{errInput.tuition}</span>
                            </div>
                            <div className="">
                                <label className="mb-2.5 block text-black " htmlFor="busNumber">
                                    Nhập biển số xe
                                </label>
                                <input
                                    type="text"
                                    id="busNumber"
                                    placeholder="Nhập biển số xe"
                                    value={dataInput.busNumber}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                                <span className="text-error text-xs">{errInput.busNumber}</span>
                            </div>
                        </div>
                        <Button primary large roundedMd>
                            Tạo xe
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTransportation;
