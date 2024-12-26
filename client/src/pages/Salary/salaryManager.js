// dành cho accountant để quản lí
// dành cho teacher, staff
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
//import { useSelector } from 'react-redux';

function ManagerSalary() {
    const [employeeSalary, setEmployeeSalary] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('all');
    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };
    const navigate = useNavigate();

    // Giả lập kiểm tra xác thực

    /*if (!userAuthenticated) {
        navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu không xác thực
    } else if (!['teacher', 'staff', 'accountant'].includes(user.role)) {
        navigate('/no-access'); // Chuyển hướng đến trang không có quyền truy cập nếu người dùng không thuộc role cho phép
    } */
    useEffect(() => {
        // Giả lập kiểm tra xác thực
        const userAuthenticated = true; // Thay thế bằng logic xác thực thực tế

        if (!userAuthenticated) {
            navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu không xác thực
        } else {
            setIsAuthenticated(true);
            // Giả lập dữ liệu bảng lương của một nhân viên
            setEmployeeSalary({
                name: 'Nguyễn Văn A',
                role: 'Nhân viên',
                salaryDetails: [
                    {
                        month: 'Tháng 1',
                        name: 'Nguyễn Tuyết Nhi',
                        role: 'Giáo viên',
                        income: '15,000,000 VND',
                        status: 'Đã thanh toán',
                        dateReceived: '2024-01-31',
                    },
                    {
                        month: 'Tháng 1',
                        name: 'Nguyễn Văn A',
                        role: 'Nhân viên hành chính',
                        income: '15,000,000 VND',
                        status: 'Đã thanh toán',
                        dateReceived: '2024-01-31',
                    },
                    {
                        month: 'Tháng 1',
                        name: 'Nguyễn Văn A',
                        role: 'Thu ngân',
                        income: '15,000,000 VND',
                        status: 'Đã thanh toán',
                        dateReceived: '2024-01-31',
                    },
                    {
                        month: 'Tháng 1',
                        name: 'Nguyễn Văn A',
                        role: 'Nhân viên hành chính',
                        income: '15,000,000 VND',
                        status: 'Đã thanh toán',
                        dateReceived: '2024-01-31',
                    },
                    {
                        month: 'Tháng 2',
                        name: 'Nguyễn Văn A',
                        role: 'Giáo viên',
                        income: '15,000,000 VND',
                        status: 'Đã thanh toán',
                        dateReceived: '2024-02-28',
                    },
                    {
                        month: 'Tháng 2',
                        name: 'Nguyễn Văn A',
                        role: 'Nhân viên hành chính',
                        income: '15,000,000 VND',
                        status: 'Chưa thanh toán',
                        dateReceived: '',
                    },
                    {
                        month: 'Tháng 2',
                        name: 'Nguyễn Văn A',
                        role: 'Nhân viên hành chính',
                        income: '15,000,000 VND',
                        status: 'Chưa thanh toán',
                        dateReceived: '',
                    },
                ],
            });
        }
    }, [navigate]);
    if (!isAuthenticated) {
        return <div>Đang kiểm tra xác thực...</div>;
    }

    if (!employeeSalary) {
        return <div>Đang tải dữ liệu...</div>;
    }
    const handleExport = () => {
        const data = [
            { 'Họ và tên': employeeSalary.name },
            { 'Chức vụ': employeeSalary.role },
            // Thêm các thông tin khác của nhân viên ở đây
        ];

        // Thêm dữ liệu chi tiết các tháng
        const monthData = employeeSalary.salaryDetails.map((salaryDetails) => ({
            Tháng: salaryDetails.month,
            'Thu nhập': salaryDetails.income,
            'Trạng thái': salaryDetails.status,
            'Ngày nhận': salaryDetails.dateReceived,
        }));

        // Kết hợp dữ liệu nhân viên và dữ liệu chi tiết các tháng
        const combinedData = [...data, ...monthData];

        // Chuyển đổi dữ liệu thành bảng tính
        const ws = XLSX.utils.json_to_sheet(combinedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bảng lương');

        // Xuất file Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'bang-luong-ca-nhan.xlsx');
    };
    const handlePayment = (selectedDetail) => {
        // Thực hiện logic thanh toán ở đây, chỉ cho phép cập nhật nếu là 'Giáo viên', 'Nhân viên hành chính' hoặc 'Thu ngân'
        if (['Giáo viên', 'Nhân viên hành chính', 'Thu ngân'].includes(selectedDetail.role)) {
            const updatedSalaryDetails = employeeSalary.salaryDetails.map((detail) =>
                detail.month === selectedDetail.month
                    ? { ...detail, status: 'Đã thanh toán', dateReceived: new Date().toLocaleDateString() }
                    : detail,
            );

            setEmployeeSalary({
                ...employeeSalary,
                salaryDetails: updatedSalaryDetails,
            });
        }
    };
    /*const handleEdit = (annoucement) => {
        setEditingAnnouce(annoucement);
        setIsEditPopupOpen(true);
    };*/
    const handleSortSubmit = (e) => {
        e.preventDefault();
        window.alert(sortCriteria);
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Quản lí lương</h1>
            <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handleExport} className="right-0" outlinePrimary icon={<Home01Icon />}>
                        Export
                    </Button>
                </div>
                <div className=" flex">
                    <form onSubmit={handleSortSubmit} className="flex mr-3">
                        <div className="flex">
                            <select
                                className="w-30 text-center mr-3  select-auto bg-gray-300"
                                value={sortCriteria}
                                onChange={handleSortChange}
                                name="sCriteria"
                            >
                                <option value="all">Tất cả</option>
                                <option value="03"> Tháng 1 </option>
                                <option value="04"> Tháng 2</option>
                                <option value="05"> Tháng 3</option>
                                <option value="06"> Tháng 4</option>
                                <option value="06"> Tháng 5</option>
                                <option value="06"> Tháng 6</option>
                                <option value="06"> Tháng 7</option>
                                <option value="06"> Tháng 8</option>
                                <option value="06"> Tháng 9</option>
                                <option value="06"> Tháng 10</option>
                                <option value="06"> Tháng 11</option>
                                <option value="06"> Tháng 12</option>
                            </select>
                            <Button primary className="rounded-md">
                                Sắp xếp
                            </Button>
                        </div>
                    </form>
                </div>
                <p className="text-l font-semibold mt-4 mb-2">Chi tiết bảng lương</p>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-primary">
                        <tr>
                            <th className="py-2 border border-gray-300">Tháng</th>
                            <th className="py-2 border border-gray-300">Họ và tên</th>
                            <th className="py-2 border border-gray-300">Chức vụ</th>
                            <th className="py-2 border border-gray-300">Tiền lương</th>
                            <th className="py-2 border border-gray-300">Trạng thái</th>
                            <th className="py-2 border border-gray-300">Ngày nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeSalary.salaryDetails.map((detail, index) => (
                            <tr key={index} className="border-b border-gray-300 text-center">
                                <td className="py-2 border border-gray-300">{detail.month}</td>
                                <td className="py-2 border border-gray-300">{detail.name}</td>
                                <td className="py-2 border border-gray-300">{detail.role}</td>
                                <td className="py-5 border border-gray-300 relative">
                                    <span className="mr-5">{detail.income}</span>
                                    <button className=" absolute top-1/2 right-2 transform -translate-y-1/2 flex rounded-md bg-blue-500 px-2.5 py-1 text-sm font-semibold text-white hover:bg-blue-600 items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 text-red-500"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                </td>
                                <td
                                    className={`py-2 border border-gray-100  flex justify-center ${detail.status === 'Đã thanh toán' ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {detail.status === 'Chưa thanh toán' ? (
                                        <Button className="text-center" onClick={() => handlePayment(detail)}>
                                            Thanh toán
                                        </Button>
                                    ) : (
                                        'Đã thanh toán'
                                    )}
                                </td>
                                <td className="py-2 border border-gray-300">{detail.dateReceived}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagerSalary;
