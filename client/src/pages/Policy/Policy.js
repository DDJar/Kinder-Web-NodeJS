import React from 'react';
import Sidebar from '../../pages/Profile/ProfileSidebar';

const policies = [
    {
        title: 'Chính sách bảo mật',
        content: `Chúng tôi cam kết bảo mật thông tin của bạn. Mọi thông tin cá nhân sẽ được bảo mật và chỉ được sử dụng cho các mục đích hợp pháp.`,
    },
    {
        title: 'Chính sách bảo vệ trẻ em',
        content: `Chúng tôi cam kết đảm bảo sự an toàn và bảo vệ cho tất cả trẻ em trong trường. Các quy trình và chính sách được thiết lập để đảm bảo môi trường học tập an toàn.`,
    },
    {
        title: 'Chính sách hủy',
        content: `Nếu bạn cần hủy bỏ dịch vụ, vui lòng thông báo trước ít nhất 24 giờ để tránh bị tính phí.`,
    },
    {
        title: 'Chính sách hoàn tiền',
        content: `Chúng tôi sẽ hoàn tiền trong trường hợp bạn gặp phải vấn đề không mong muốn với dịch vụ của chúng tôi. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.`,
    },
];

const PolicyPage = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Chính Sách Trường Mầm Non ABC</h1>
                {policies.map((policy, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">{policy.title}</h2>
                        <p className="text-gray-700">{policy.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolicyPage;
