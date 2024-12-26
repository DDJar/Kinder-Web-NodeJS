import { useState } from 'react';
import PageTitle from '~/common/PageTitle';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendLink } from '~/api/user';
import axios from 'axios';

function SendLinkMail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSendLink = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!validation(email)) {
                setEmailError('Định dạng email không hợp lệ.');
                setIsSubmitting(false);
            } else {
                const otpForm = {
                    email: email,
                };
                const res = await axios({
                    method: sendLink.method,
                    url: sendLink.url,
                    data: otpForm,
                    withCredentials: true,
                });
                console.log(res.data);
                if (res.data.status === 200) {
                    toast.success('Gửi thành công', {
                        autoClose: 1000,
                        closeOnClick: true,
                    });
                    navigate(`/verify-notification`);
                } else if (res.data.status === 404 && res.data.message === 'User not found') {
                    toast.error(`Gửi thất bại`, {
                        render: `${res.data.message}`,
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                    });
                }
            }
        } catch (error) {
            toast.error(`Gửi thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const validation = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    return (
        <div className="bg-white rounded-lg">
            <PageTitle title="Kindergarten | login" />
            <div className="container flex flex-col mx-auto bg-white rounded-lg mt-5 w-full max-w-lg">
                <div className="flex justify-center w-full">
                    <form
                        className="flex flex-col w-full h-full text-center bg-white border shadow-lg px-10 py-2 rounded-lg"
                        onSubmit={handleSendLink}
                    >
                        <h3 className="mb-3 text-4xl font-extrabold text-secondary">Nhập email để xác thực</h3>
                        <label htmlFor="email" className="text-sm text-start text-cyan-950">
                            Email<span className="text-error">*</span>
                            <span className="mt-0 text-xs text-error text-left ml-5">{emailError}</span>
                        </label>

                        <input
                            id="email"
                            type="text"
                            placeholder="Nhập email hoặc số điện thoại"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex items-center w-full mb-3 px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                        />
                        <Button primary large type="submit" disabled={isSubmitting}>
                            Gửi
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SendLinkMail;
