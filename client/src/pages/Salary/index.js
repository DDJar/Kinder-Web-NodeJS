import React, { useState, useEffect } from 'react';
import { Navbar } from 'reactstrap';
import { toast } from 'react-toastify';
import { Home01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { getSalary } from '~/api/payment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function PersonalSalary() {
    const [salaries, setSalaries] = useState([]);
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [months, setMonths] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterByMonth(selectedMonth);
    }, [selectedMonth, salaries]);

    const fetchData = async () => {
        try {
            const res = await axios({
                method: getSalary.method,
                url: getSalary.url,
                withCredentials: true,
            });

            if (res.data.status === 200) {
                const salariesWithDates = res.data.data.map((salaryItem) => ({
                    ...salaryItem,
                    createdAt: new Date(salaryItem.createdAt),
                    updatedAt: new Date(salaryItem.updatedAt),
                    endDate: new Date(salaryItem.endDate),
                }));

                setSalaries(salariesWithDates);

                // Extract unique months from data
                const uniqueMonths = [
                    ...new Set(
                        salariesWithDates.map((item) =>
                            item.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' }),
                        ),
                    ),
                ];
                setMonths(uniqueMonths);

                setFilteredSalaries(salariesWithDates);
                toast.success('Hiển thị thành công', {
                    autoClose: 1000,
                    closeOnClick: true,
                });
            } else {
                console.log('Error:', res.data.message);
            }
        } catch (error) {
            toast.error(`Hiển thị thất bại: ${error.message}`, {
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };

    const filterByMonth = (month) => {
        if (!month) {
            setFilteredSalaries(salaries);
        } else {
            const filtered = salaries.filter(
                (salaryItem) =>
                    salaryItem.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' }) === month,
            );
            setFilteredSalaries(filtered);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleExport = () => {
        const data = filteredSalaries.map((salaryItem) => ({
            'Mã lương': salaryItem.salaryId || 'N/A',
            'Phương thức thanh toán': salaryItem.payMethod || 'N/A',
            'Mã giao dịch': salaryItem.transactionId || 'N/A',
            'Ngày tạo': salaryItem.createdAt ? new Date(salaryItem.createdAt).toLocaleDateString() : 'N/A',
            'Ngày cập nhật': salaryItem.updatedAt ? new Date(salaryItem.updatedAt).toLocaleDateString() : 'N/A',
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx');
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-5 text-center">Bảng lương</h1>
                <div className="flex items-center mb-5">
                    <label htmlFor="month" className="mr-2">
                        Chọn tháng:
                    </label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Tất cả</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleExport} className="right-0" outlinePrimary icon={<Home01Icon />}>
                    Export
                </Button>
                <div className="mt-10 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã lương
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phương thức thanh toán
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã giao dịch
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày cập nhật
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSalaries.map((salaryItem) => (
                                <tr key={salaryItem._id} className="border-b">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {salaryItem.salaryId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {salaryItem.payMethod}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {salaryItem.transactionId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {salaryItem.createdAt.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {salaryItem.updatedAt.toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default PersonalSalary;
