import React, { useState } from 'react';
import PageTitle from '~/common/PageTitle';
import Button from '~/components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassWords } from '~/api/user';
import axios from 'axios';

function ResetPassWords() {
    const navigate = useNavigate();
    const [resetPass, setResetPass] = useState({
        passwords: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        passwords: '',
        confirmPassword: '',
    });
    let { id } = useParams();
    const handleResetPassword = async (event) => {
        event.preventDefault();
        const hasErrors = Object.values(errors).some((error) => error !== '');
        const hasResest = Object.values(resetPass).some((pass) => pass === '');
        if (hasErrors || hasResest) {
            toast.warning('Vui lòng điền đầy đủ thông tin.', {
                autoClose: 1000,
                closeOnClick: true,
            });
            return;
        }

        try {
            const resetForm = {
                newPassword: resetPass.passwords,
                confirmPassword: resetPass.confirmPassword,
            };
            const res = await axios({
                method: resetPassWords.method,
                url: resetPassWords.url,
                data: resetForm,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${id}`,
                },
            });
            if (res.data.status === 200) {
                toast.success('Đổi thành công', {
                    autoClose: 1000,
                    closeOnClick: true,
                });
                navigate(`/login`);
            } else if (res.data.status === 401 && res.data.message === 'Wrong token!') {
                toast.error(`Hết thời gian đổi mật khẩu`, {
                    render: `${res.data.message}`,
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                });
            } else if (res.data.status === 400 && res.data.message === 'Invalid password') {
                toast.warning(`Mật khẩu xác nhận không trùng khớp`, {
                    render: `${res.data.message}`,
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            toast.error(`Đổi thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleInputChange = (field, value) => {
        setResetPass({ ...resetPass, [field]: value });
        switch (field) {
            case 'passwords':
                setErrors({
                    ...errors,
                    passwords: value.length >= 10 ? '' : 'Mật khẩu phải có độ dài ít nhất 10 ký tự',
                });
                break;
            case 'confirmPassword':
                setErrors({
                    ...errors,
                    confirmPassword: value === resetPass.passwords ? '' : 'Mật khẩu không khớp',
                });
                break;
            default:
                break;
        }
    };
    return (
        <div className="bg-white rounded-lg">
            <PageTitle title="Kindergarten | login" />
            <div className="container flex flex-col mx-auto bg-white rounded-lg mt-5 w-full max-w-lg">
                <div className="flex justify-center w-full">
                    <form
                        className="flex flex-col w-full h-full text-center bg-white border shadow-lg px-10 py-2 rounded-lg"
                        onSubmit={handleResetPassword}
                    >
                        <h3 className="mb-3 text-4xl font-extrabold text-secondary">Cập nhật lại mật khẩu</h3>
                        <label htmlFor="email" className="text-sm text-start text-cyan-950">
                            Mật khẩu mới<span className="text-error">*</span>
                            <span className="mt-0 text-xs text-error text-left ml-5">{errors.passwords}</span>
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={resetPass.passwords}
                            onChange={(e) => handleInputChange('passwords', e.target.value)}
                            className="flex items-center w-full mb-3 px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                        />
                        <label htmlFor="email" className="text-sm text-start text-cyan-950">
                            Nhập lại mật khẩu<span className="text-error">*</span>
                            <span className="mt-0 text-xs text-error text-left ml-5">{errors.confirmPassword}</span>
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={resetPass.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="flex items-center w-full mb-3 px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                        />
                        <Button primary large type="submit">
                            Cập nhật
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassWords;
