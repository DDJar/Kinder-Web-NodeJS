import { useState } from 'react';
import PageTitle from '~/common/PageTitle';
import Button from '~/components/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginApi, loginGoogle } from '~/api/user';
import axios from '~/config/configAxios';
import { useUserProvider } from '~/hooks/user/useUserProvider';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(true);

    const { login } = useUserProvider();

    const handleLogin = async (e) => {
        e.preventDefault();

        setIsSubmitted(true);

        // Reset error
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
        setIsUsernameValid(true);

        const isPasswordValid = password.length >= 1 && !password.includes(' ');
        if (username.trim().length === 0) {
            setIsUsernameValid(false);
            setUsernameError('Username không được bỏ trống');
        }
        if (password.trim().length === 0) {
            setUsernameError('Password không được bỏ trống');
        }
        // isPasswordValid = true => !isPasswordValid = false
        if (!isPasswordValid) {
            setPasswordError('Mật khẩu phải có độ dài 10 ký tự và không có dấu cách');
        }
        if (isUsernameValid && isPasswordValid) {
            const data = {
                username: username,
                password: password,
            };
            const id = toast.loading('Đang đăng nhập...');
            try {
                const res = await axios({
                    method: loginApi.method,
                    url: loginApi.url,
                    data: data,
                });
                if (res.data.status === 200) {
                    toast.update(id, {
                        render: 'Đăng nhập thành công',
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                    login(res.data.data, res.data.token);
                    if (res.data.data.role === 'USER') {
                        navigate('/');
                    } else {
                        navigate('/dashboards');
                    }
                } else {
                    setLoginError('Email hoặc Password hiện không đúng');
                    toast.update(id, {
                        render: `Email hoặc Password hiện không đúng`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                }
            } catch (error) {
                setLoginError('Lỗi server');
                toast.update(id, {
                    render: `Đăng nhập thất bại ${error.message}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        }
    };
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        window.open(loginGoogle.url, '_self');
    };
    const handleEmailChange = (e) => {
        const value = e.target.value.trim().replace(/\s/g, '');
        setUsername(value);

        if (!value) {
            setUsernameError('Email không được để trống');
        } else {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value.trim().replace(/\s/g, '');
        setPassword(value);

        if (!value) {
            setPasswordError('Mật khẩu không được để trống');
        } else {
            setPasswordError('');
        }
    };

    return (
        <div className="bg-white rounded-lg">
            <PageTitle title="Kindergarten | login" />
            <div className="container flex flex-col mx-auto bg-white rounded-lg mt-5 w-full max-w-lg">
                <div className="flex  justify-center w-full">
                    <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white border shadow-lg py-2 px-10"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin(e);
                        }}
                    >
                        <h3 className="mb-3 text-4xl font-extrabold text-secondary">Đăng Nhập</h3>
                        <p className="mb-1 text-zinc-400 text-sm">Đăng nhập với</p>
                        <button
                            type="button"
                            className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-slate-50 hover:bg-slate-100 focus:ring-4 focus:ring-grey-300"
                            onClick={handleGoogleLogin}
                        >
                            <img
                                className="h-5 mr-2"
                                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                                alt=""
                            />
                            Đăng Nhập với Google
                        </button>
                        <div className="flex items-center mb-3">
                            <hr className="h-0 border-b border-solid border-zinc-200 grow" />
                            <p className="mx-4  text-zinc-400 text-sm">Hoặc</p>
                            <hr className="h-0 border-b border-solid border-zinc-200 grow" />
                        </div>
                        {isSubmitted && loginError && (
                            <span className="mt-0 text-center text-xs text-error ">{loginError}</span>
                        )}
                        <label htmlFor="username" className="text-sm text-start text-cyan-950">
                            Email hoặc số điện thoại <span className="text-error">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nhập email hoặc số điện thoại"
                            onChange={handleEmailChange}
                            className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                        />
                        {isSubmitted && usernameError && (
                            <span className="mt-0 text-xs text-error  text-left">{usernameError}</span>
                        )}
                        <label htmlFor="password" className="mt-3 text-sm text-start text-cyan-950">
                            Mật khẩu <span className="text-error">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            onChange={handlePasswordChange}
                            className="flex items-center w-full px-5 py-4  text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                        />
                        {isSubmitted && passwordError && (
                            <span className="mb-2 text-xs text-error  text-left">{passwordError}</span>
                        )}
                        <div className="flex flex-row justify-end mb-4 mt-4">
                            <NavLink
                                to="/forgot-password"
                                className="w-100 mr-4 text-end text-sm font-medium text-cyan-600"
                            >
                                Quên mật khẩu?
                            </NavLink>
                        </div>
                        <Button primary large onClick={(e) => handleLogin(e)}>
                            Đăng nhập
                        </Button>
                        <p className="text-sm leading-relaxed text-cyan-950 mt-3">
                            Chưa có tài khoản?{' '}
                            <NavLink to="/register" className="font-bold text-zinc-500">
                                Tạo tài khoản
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
