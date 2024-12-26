import React from 'react';

const CameraSetupPage = () => {
    return (
        <div className="mx-auto p-6 bg-white shadow-md rounded-md mt-8">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                Hướng Dẫn Cài Đặt Camera Hik-Connect
            </h2>
            <ol className="list-decimal pl-6 space-y-4 text-gray-700">
                <li>
                    <span className="font-semibold">Bước 1: Khởi động ứng dụng Hik-Connect</span>
                    <p>
                        Bạn mở ứng dụng Hik-Connect trên điện thoại thông minh rồi chọn chế độ đăng nhập là Visitor
                        Mode.
                    </p>
                    <img
                        src="https://th.bing.com/th/id/OIP.nSlHvkh-UWogwkGPoPTjoQHaGl?rs=1&pid=ImgDetMain"
                        alt="anh1"
                    />
                </li>
                <li>
                    <span className="font-semibold">Bước 2: Đăng ký tài khoản</span>
                    <p>
                        Bạn nhấn vào mục More ở góc bên phải, phía dưới màn hình.Tiếp theo, bạn bấm vào
                        <span className="font-semibold"> Register an account (đăng ký 1 tài khoản)</span>, chọn Agree.
                        Bọn chọn đăng ký bằng số điện thoại hoặc email, nhập thông tin rồi ấn
                        <span className="font-semibold">Get Verification Code.</span>
                    </p>
                    <img
                        className="w-80"
                        src="https://camerahainam.net/wp-content/uploads/2023/03/cach-dang-ky-tai-khoan-hikvision-2.jpg"
                        alt="anh1"
                    />
                </li>
                <li>
                    <span className="font-semibold">Bước 3: Nhập mã xác thực (Verification Code) và mật khẩu</span>
                    <p>
                        Hệ thống sẽ nhập mã xác thực được gửi đến email hoặc số điện thoại sử dụng để đăng ký.Bạn nhập
                        mã xác thực này vào ô Verification Code và mật khẩu vào ô Password, nhấn Finish.
                    </p>
                    <img
                        className="w-80"
                        src="https://th.bing.com/th/id/OIP.CMcAvMyH4qGHpYuM7ML8HQHaEH?pid=ImgDet&w=60&h=60&c=7&dpr=1.4&rs=1"
                        alt="anh1"
                    />
                </li>
                <li>
                    <span className="font-semibold">Bước 4: Đăng ký thành công và Exit</span>
                    <p>
                        Hệ thống thông báo Completed nghĩa là bạn đã đăng ký thành công. Sau đó, bạn nhấn Exit để thoát.
                    </p>
                    <img
                        className="w-80"
                        src="https://th.bing.com/th/id/R.cf0ac06700b0450eacbfe9a14034314c?rik=LhvhIC1k5QQIEw&riu=http%3a%2f%2fhikvision.vn%2fwp-content%2fuploads%2f2018%2f10%2fsu-dung-hik-connect-app-Cac-cach-reset-khoi-phuc-mat-khau-hikvision-1.png&ehk=JcJMbquPhnUSTLYn4%2bpuABilt2rN11uiOqS0zgS1aUk%3d&risl=&pid=ImgRaw&r=0"
                        alt="anh1"
                    />
                </li>
            </ol>
        </div>
    );
};

export default CameraSetupPage;
