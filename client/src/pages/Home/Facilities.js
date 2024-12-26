import {
    DribbbleIcon,
    FavouriteIcon,
    GraduateMaleIcon,
    MusicNote01Icon,
    PaintBoardIcon,
    SafeIcon,
} from 'hugeicons-react';
import React from 'react';

const Facilities = () => {
    const facilities = [
        {
            icon: <DribbbleIcon className="size-20 text-primary" />,
            title: 'Sân Chơi',
            description: 'Khu vực an toàn và vui nhộn để trẻ em thỏa sức vận động, vui chơi, phát triển thể chất',
        },
        {
            icon: <MusicNote01Icon className="size-20 text-primary" />,
            title: 'Âm nhạc',
            description: 'Các hoạt động âm nhạc và nhảy múa giúp trẻ em phát triển kỹ năng cảm thụ âm nhạc...',
        },
        {
            icon: <PaintBoardIcon className="size-20 text-primary" />,
            title: 'Hội hoạ',
            description: 'Kích thích sự sáng tạo của trẻ thông qua các hoạt động vẽ tranh, thủ công và các...',
        },
        {
            icon: <SafeIcon className="size-20 text-primary" />,
            title: 'Phương tiện an toàn',
            description: 'Đảm bảo an toàn khi di chuyển, với các phương tiện đạt chuẩn cho trẻ nhỏ',
        },
        {
            icon: <FavouriteIcon className="size-20 text-primary" />,
            title: 'Thực phẩm lành mạnh',
            description: 'Cung cấp bữa ăn lành mạnh, đầy đủ dinh dưỡng giúp trẻ phát triển toàn diện',
        },
        {
            icon: <GraduateMaleIcon className="size-20 text-primary" />,
            title: 'Chuyến tham quan giáo dục',
            description: 'Những chuyến đi thực tế giúp trẻ học hỏi, khám phá thế giới xung quanh qua các hoạt động...',
        },
    ];

    return (
        <div className=" pt-5">
            <div className="container pb-3">
                <div className="flex flex-wrap -mx-3">
                    {facilities.map((facility, index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-3 pb-4">
                            <div className="flex bg-gray-200 shadow-sm border-t rounded mb-4 p-8">
                                {facility.icon}
                                <div className="pl-4">
                                    <h4 className="text-xl font-semibold">{facility.title}</h4>
                                    <p className="m-0 text-gray-700">{facility.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Facilities;
