import axios from '~/config/configAxios';
import { useState } from 'react';
import { toast } from 'react-toastify';

import Button from '~/components/Button';
import { createRoom } from '~/api/room';
import { validateInputRequire } from '~/utils/validate';

function CreateRoom() {
    const [dataInput, setDataInput] = useState({
        name: '',
        totalSeats: '',
        cameraUrl: '',
    });

    const [errInput, setErrInput] = useState({
        name: '',
        totalSeats: '',
        cameraUrl: '',
    });

    const handleChange = (_name, _value) => {
        let err = '';
        if (_name === 'totalSeats') {
            _value = parseInt(_value, 10);
            if (isNaN(_value) || _value < 0 || _value > 100) {
                err = 'Số chỗ khả dụng phải nằm trong khoảng từ 0 đến 100';
            }
        }
        switch (_name) {
            case 'name':
                err = validateInputRequire(_value, 3, 100);
                break;
            case 'cameraUrl':
                err = !_value ? 'Vui lòng nhập URL camera' : '';
                break;
            default:
                break;
        }

        setDataInput((prev) => ({ ...prev, [_name]: _value }));
        setErrInput((prev) => ({ ...prev, [_name]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Trigger validation for all fields
        handleChange('name', dataInput.name);
        handleChange('totalSeats', dataInput.totalSeats);
        handleChange('cameraUrl', dataInput.cameraUrl);

        // Check if any error exists
        for (let key in errInput) {
            if (errInput[key]) return;
        }

        const id = toast.loading('Vui lòng chờ...');
        try {
            const res = await axios({
                url: createRoom.url,
                method: createRoom.method,
                data: { ...dataInput },
            });

            if (res.data.status === 200) {
                setDataInput({
                    name: '',
                    totalSeats: '',
                    cameraUrl: '',
                });

                toast.update(id, {
                    render: 'Tạo phòng thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                throw new Error(res.data.message);
            }
        } catch (error) {
            toast.update(id, {
                render: `Tạo phòng thất bại: ${error.response?.data?.message || error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="flex justify-start">Tạo phòng học</h1>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <form action="#" onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="flex flex-wrap">
                            <div className="mb-4.5 w-full lg:w-8/12 pr-2">
                                <label className="mb-2.5 block text-black" htmlFor="name">
                                    Tên phòng
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={dataInput.name}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    placeholder="Nhập tên phòng"
                                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.name}</span>
                            </div>

                            <div className="mb-4.5 w-full lg:w-4/12 pl-2">
                                <label className="mb-2.5 block text-black" htmlFor="totalSeats">
                                    Số chỗ khả dụng
                                </label>
                                <input
                                    type="number"
                                    id="totalSeats"
                                    value={dataInput.totalSeats}
                                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                                    placeholder="Nhập số chỗ khả dụng (0-100)"
                                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary"
                                />
                                <span className="text-error text-xs ml-5">{errInput.totalSeats}</span>
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="mb-2.5 block text-black" htmlFor="cameraUrl">
                                Camera URL
                            </label>
                            <input
                                type="url"
                                id="cameraUrl"
                                value={dataInput.cameraUrl}
                                onChange={(e) => handleChange(e.target.id, e.target.value)}
                                placeholder="Nhập URL Camera"
                                className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary"
                            />
                            <span className="text-error text-xs ml-5">{errInput.cameraUrl}</span>
                            <a
                                href="https://g33ktricks.blogspot.com/p/the-rtsp-real-time-streaming-protocol.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline mt-2 block"
                            >
                                Truy cập vào đây để lấy Camera url
                            </a>
                        </div>

                        <Button primary large roundedMd>
                            Tạo phòng học
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRoom;
