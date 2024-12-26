import React from 'react';

const NotificationEmail = () => {
    return (
        <div className="bg-white rounded-lg">
            <div className="container flex flex-col mx-auto bg-white rounded-lg mt-5 w-full max-w-lg">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-3xl font-bold mb-4">Gửi mail thành công!</h1>
                    <div className="text-green-500 text-6xl mb-4">✔️</div>
                    <p className="text-gray-700">
                        Vui lòng kiểm tra email để cập nhật mật khẩu mới cho tài khoản. Cảm ơn
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationEmail;
