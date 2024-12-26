import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import { createListUsers } from '~/api/user';
import ListUsersRes from '~/pages/Dashboard/ListUsersRes';
import Loading from '~/components/Loading';

const CreateUser = () => {
    const [csvData, setCsvData] = useState([]);
    const [dataRes, setDataRes] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleChangeFile = () => {
        const file = fileInputRef.current.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                encoding: 'ISO-8859-1',
                complete: (results) => {
                    const filteredData = results.data.filter((row) => {
                        return Object.values(row).some((value) => value);
                    });
                    setCsvData(filteredData);
                    console.log(filteredData);
                    setHasData(true);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    toast.error('Failed to parse CSV file');
                    return;
                },
            });
        } else {
            console.error('No file selected');
            return;
        }
    };

    const handleClearFile = () => {
        fileInputRef.current.value = '';
        setHasData(false);
    };

    const handleSubmitFileUser = async () => {
        if (csvData[0]) {
            const id = toast.loading('Đang tạo user...');
            try {
                setIsLoading(true);
                setDataRes([]);
                const res = await axios({
                    method: createListUsers.method,
                    url: createListUsers.url,
                    data: csvData,
                    withCredentials: true,
                });
                if (res.data.status === 200) {
                    setDataRes(res.data.data);
                    toast.update(id, {
                        render: `Tạo tài khoản thành công`,
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                    setCsvData([]);
                } else {
                    console.log('error');
                }
                setIsLoading(false);
            } catch (error) {
                console.log('error');
                toast.update(id, {
                    render: `Tạo thất bại ${error.message}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="">
            {/* <!-- Contact Form --> */}

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 ">
                    <h3 className="font-medium text-black ">File upload</h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <label className="mb-3 block text-black " htmlFor="file-upload">
                            Attach file
                        </label>
                        <input
                            ref={fileInputRef}
                            onChange={handleChangeFile}
                            type="file"
                            accept=".csv"
                            id="file-upload"
                            className="mb-5 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary"
                        />
                        <div className="flex space-x-4">
                            <Button disable={!hasData} roundedMd error onClick={handleClearFile}>
                                Xóa file
                            </Button>
                            <Button roundedMd primary onClick={handleSubmitFileUser} disable={!hasData}>
                                Tạo users
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {isLoading && <Loading />}
                {dataRes.length > 0 && <ListUsersRes data={dataRes} />}
            </div>
        </div>
    );
};

export default CreateUser;
