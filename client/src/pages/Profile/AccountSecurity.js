import React, { useState } from 'react';
import Sidebar from './ProfileSidebar';
import axios from '~/config/configAxios';
import { changePassword } from '~/api/user';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const AccountSecurity = () => {
    const { user } = useUserProvider();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const validate = () => {
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và mật khẩu xác nhận không khớp.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        // Prepare data for the password change
        const data = {
            user,
            currentPassword,
            newPassword,
        };
        console.log('data', data);

        // Display a loading toast notification
        const toastId = toast.loading('Đang thay đổi mật khẩu...');

        try {
            const response = await axios({
                method: changePassword.method,
                url: changePassword.url,
                data: data,
                withCredentials: true,
            });

            if (response.data.status === 200) {
                toast.update(toastId, {
                    render: 'Mật khẩu đã được cập nhật thành công.',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                // Optionally, clear the form or reset state
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.update(toastId, {
                    render: `Cập nhật mật khẩu thất bại: ${response.data.message}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        } catch (error) {
            toast.update(toastId, {
                render: `Cập nhật mật khẩu thất bại: ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Bảo mật tài khoản</h2>
                <p className="text-gray-600 font-medium mb-6">Thay đổi mật khẩu và cài đặt tài khoản ở đây.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="current-password" className="block font-semibold text-gray-700 mb-2">
                            Nhập mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-password" className="block font-semibold text-gray-600 mb-2">
                            Nhập mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block font-semibold text-gray-600 mb-2">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>
                    <Button primary type="submit" className="text-white px-4 py-2 rounded-md hover:bg-gray-500">
                        Đổi mật khẩu
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AccountSecurity;
