/* eslint-disable no-unused-vars */
import axios from '~/config/configAxios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registAccount, loginGoogle } from '~/api/user';
import PageTitle from '~/common/PageTitle';
// import { toastError, toastSuccess, toastWarn } from '~/common/Toastify/toastCommon';
import Button from '~/components/Button';
import { reget } from '~/utils/validate';

function getInputClass(field, isSubmitted, errors) {
    return `flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-50 placeholder:text-grey-700  ${
        isSubmitted && errors[field] ? 'border border-red-600' : 'bg-slate-50'
    } rounded-2xl`;
}

function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errors, setErrors] = useState({});
    const [registerError, setRegisterError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [type, setType] = useState('email');

    const handleRegister = async (e) => {
        e.preventDefault();

        setIsSubmitted(true);

        // Reset error
        setErrors({});

        // Check email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailPattern.test(email);

        // check phone number
        const phonePattern = /^[0-9]{10}$/;
        const isPhoneValid = phonePattern.test(phone);

        // check password
        const isPasswordValid = password.length >= 10;
        const isPasswordMatched = password === rePassword;

        let validationErrors = {};

        if (!firstName.trim()) {
            validationErrors.firstName = 'Tên không được để trống';
        }

        if (!lastName.trim()) {
            validationErrors.lastName = 'Họ không được để trống';
        }

        if ((!email.trim() && !phone.trim()) || (email.trim() && !isEmailValid)) {
            if (!email.trim() && !phone.trim()) {
                validationErrors.email = 'Email không được để trống';
                validationErrors.phone = 'Số điện thoại không được để trống';
            } else if (email.trim() && !isEmailValid) {
                validationErrors.email = 'Email không hợp lệ';
            }
        } else {
            if (!phone.trim()) {
                validationErrors.phone = 'Số điện thoại không được để trống';
            } else if (!isPhoneValid) {
                validationErrors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (!password.trim()) {
            validationErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (!isPasswordValid) {
            validationErrors.password = 'Mật khẩu phải có độ dài ít nhất 10 ký tự';
        }

        if (!rePassword.trim()) {
            validationErrors.rePassword = 'Vui lòng nhập lại mật khẩu';
        } else if (!isPasswordMatched) {
            validationErrors.rePassword = 'Mật khẩu không khớp';
        }

        if (type === 'email') {
            delete validationErrors.phone;
        } else {
            delete validationErrors.email;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const data = {
                lastName: lastName,
                firstName: firstName,
                type: type,
                username: type === 'email' ? email : phone,
                password: password,
            };
            const id = toast.loading('Đang tạo tài khoản...');
            try {
                const res = await axios({
                    method: registAccount.method,
                    url: registAccount.url,
                    data: data,
                });

                if (res.data.status === 200) {
                    toast.update(id, {
                        render: 'Tạo tài khoản thành công',
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                    navigate('/login');
                } else {
                    setRegisterError(res.data.message);
                    toast.update(id, {
                        render: `Tạo tài khoản thất bại: ${res.data.message}`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                }
            } catch (error) {
                toast.update(id, {
                    render: `Tạo tài khoản thất bại ${error.message}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        }
    };
    const handleGoogleSignup = async (e) => {
        e.preventDefault();
        window.open(loginGoogle.url, '_self');
    };
    return (
        <div className="bg-white rounded-lg w-full">
            <PageTitle title="Kindergarten | register" />

            {/* edit 3 */}
            <div className="container flex flex-col mx-auto bg-white rounded-lg mt-5 w-full max-w-lg">
                <div className="flex  justify-center w-full">
                    <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white border shadow-lg py-2 px-10"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister(e);
                        }}
                    >
                        <h3 className="mb-3 text-4xl font-extrabold text-secondary">Đăng Ký</h3>
                        <p className="mb-1 text-zinc-400 text-sm">Đăng ký với</p>
                        <button
                            type="button"
                            className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-slate-50 hover:bg-slate-100 focus:ring-4 focus:ring-grey-300"
                            onClick={handleGoogleSignup}
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
                        <span className="mt-0 text-center text-xs text-error ">{registerError}</span>
                        <div className="flex justify-between">
                            <div className="flex flex-col w-full mr-2">
                                <label htmlFor="lastName" className=" text-sm text-start text-cyan-950">
                                    Họ <span className="text-error">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Họ"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastname(reget(e.target.value));
                                        setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
                                        setRegisterError('');
                                    }}
                                    className={getInputClass('lastName', isSubmitted, errors)}
                                />
                                {isSubmitted && errors.lastName && (
                                    <span className="mt-0 text-xs text-error text-left">{errors.lastName}</span>
                                )}
                            </div>

                            <div className="flex flex-col w-full ml-2">
                                <label htmlFor="firstName" className=" text-sm text-start text-cyan-950">
                                    Tên <span className="text-error">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Tên"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstname(reget(e.target.value));
                                        setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
                                        setRegisterError('');
                                    }}
                                    className={getInputClass('firstName', isSubmitted, errors)}
                                />
                                {isSubmitted && errors.firstName && (
                                    <span className="mt-0 text-xs text-error text-left">{errors.firstName}</span>
                                )}
                            </div>
                        </div>

                        {/* tempalte 2 radio */}
                        {type === 'email' ? (
                            <>
                                <label htmlFor="email" className="mt-3 text-sm text-start text-cyan-950 ">
                                    Email <span className="text-error">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value.replace(/\s/g, ''));
                                        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                                        setRegisterError('');
                                    }}
                                    // className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl mt-2 mr-2"
                                    className={getInputClass('email', isSubmitted, errors)}
                                />
                                {isSubmitted && errors.email && (
                                    <span className="mt-0 text-xs text-error text-left">{errors.email}</span>
                                )}
                            </>
                        ) : (
                            <>
                                <label htmlFor="phone" className="mt-3 text-sm text-start text-cyan-950">
                                    Số điện thoại <span className="text-error">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Số điện thoại"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value.replace(/\s/g, ''));
                                        setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
                                        setRegisterError('');
                                    }}
                                    // className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl mt-2 "
                                    className={getInputClass('phone', isSubmitted, errors)}
                                />
                                {isSubmitted && errors.phone && (
                                    <span className="mt-0 text-xs text-error text-left">{errors.phone}</span>
                                )}
                            </>
                        )}

                        <div className="flex items-center mt-3 mb-3 select-none">
                            <input
                                type="radio"
                                id="registerByEmail"
                                name="registerOption"
                                checked={type === 'email'}
                                onChange={() => setType('email')}
                                className="mr-2"
                            />
                            <label htmlFor="registerByEmail" className="text-sm text-cyan-950">
                                Đăng ký bằng Email
                            </label>

                            <input
                                type="radio"
                                id="registerByPhone"
                                name="registerOption"
                                checked={type === 'phone'}
                                onChange={() => setType('phone')}
                                className="ml-10"
                            />
                            <label htmlFor="registerByPhone" className="text-sm text-cyan-950 ml-2">
                                Đăng ký bằng Số điện thoại
                            </label>
                        </div>

                        <label htmlFor="password" className=" text-sm text-start text-cyan-950">
                            Mật khẩu <span className="text-error">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value.replace(/\s/g, ''));
                                setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                                setRegisterError('');
                            }}
                            // className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl"
                            className={getInputClass('password', isSubmitted, errors)}
                        />
                        {isSubmitted && errors.password && (
                            <span className="mt-0 text-xs text-error text-left">{errors.password}</span>
                        )}

                        <label htmlFor="rePassword" className="mt-3 text-sm text-start text-cyan-950 ">
                            Nhập lại mật khẩu <span className="text-error">*</span>
                        </label>
                        <input
                            id="rePassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={rePassword}
                            onChange={(e) => {
                                setRePassword(e.target.value.replace(/\s/g, ''));
                                setErrors((prevErrors) => ({ ...prevErrors, rePassword: '' }));
                                setRegisterError('');
                            }}
                            // className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-slate-100 placeholder:text-grey-700 bg-slate-50 text-dark-grey-900 rounded-2xl mt-2 mb-4"
                            className={getInputClass('rePassword', isSubmitted, errors)}
                        />
                        {isSubmitted && errors.rePassword && (
                            <span className="mt-0 text-xs text-error text-left">{errors.rePassword}</span>
                        )}

                        <Button primary large onClick={(e) => handleRegister(e)} className="mt-3 ">
                            Đăng Ký
                        </Button>

                        <p className="text-sm leading-relaxed text-cyan-950 mt-4">
                            Đã có tài khoản?{' '}
                            <a href="/login" className="font-bold text-zinc-500">
                                Đăng Nhập
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
