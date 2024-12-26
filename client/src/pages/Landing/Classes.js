import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const Classes = () => {
    const { user } = useUserProvider();
    const classes = [
        {
            img: 'img/class-1.jpg',
            title: 'Lớp Vẽ',
            description:
                'Trẻ sẽ được học các kỹ thuật vẽ cơ bản, phát triển sự sáng tạo và khả năng thẩm mỹ thông qua các hoạt động nghệ thuật đa dạng. Lớp học khuyến khích trẻ khám phá thế giới qua lăng kính nghệ thuật.',
            age: '3 - 6 tuổi',
            seats: '40 học sinh',
            time: '08:00 - 10:00',
            fee: '200.000vnđ / tháng',
        },
        {
            img: 'img/class-2.jpg',
            title: 'Lớp Học Ngoại Ngữ',
            description:
                'Giúp trẻ tiếp cận ngôn ngữ một cách tự nhiên và vui nhộn. Chương trình học được thiết kế để phát triển kỹ năng ngôn ngữ thông qua các trò chơi, bài hát và câu chuyện phù hợp với lứa tuổi.',
            age: '3 - 6 tuổi',
            seats: '40 học sinh',
            time: '08:00 - 10:00',
            fee: '200.000vnđ / tháng',
        },
        {
            img: 'img/class-3.jpg',
            title: 'Lớp Khoa Học Cơ Bản',
            description:
                'Khám phá thế giới xung quanh qua các thí nghiệm khoa học đơn giản. Lớp học giúp trẻ phát triển tư duy logic và tình yêu đối với khoa học từ khi còn nhỏ.',
            age: '3 - 6 tuổi',
            seats: '40 học sinh',
            time: '08:00 - 10:00',
            fee: '200.000vnđ/ tháng',
        },
    ];

    return (
        <div className=" pt-5">
            <div className="container">
                <div className="text-center pb-2">
                    <p className="section-title px-5">
                        <span className="px-2">Lớp học phổ biến</span>
                    </p>
                    <h1 className="mb-4">Lớp học cho trẻ</h1>
                </div>
                <div className="flex flex-wrap -mx-3">
                    {classes.map((classInfo, index) => (
                        <div key={index} className="w-full lg:w-1/3 mb-5 px-3">
                            <div className="card border-0 bg-gray-100 shadow-sm pb-2">
                                <img className="card-img-top mb-2 w-203 h-75" src={classInfo.img} alt="" />
                                <div className="card-body text-center h-35">
                                    <h4 className="card-title">{classInfo.title}</h4>
                                    <p className="card-text">{classInfo.description}</p>
                                </div>
                                <div className="card-footer bg-transparent py-4 px-5">
                                    <div className="flex space-x-2 border-b">
                                        <div className="w-1/2 py-1 text-right border-r">
                                            <strong>Độ tuổi: </strong>
                                        </div>
                                        <div className="w-1/2 py-1">{classInfo.age}</div>
                                    </div>
                                    <div className="flex space-x-2 border-b">
                                        <div className="w-1/2 py-1 text-right border-r">
                                            <strong>Số lượng học sinh: </strong>
                                        </div>
                                        <div className="w-1/2 py-1">{classInfo.seats}</div>
                                    </div>
                                    <div className="flex space-x-2 border-b">
                                        <div className="w-1/2 py-1 text-right border-r">
                                            <strong>Thời gian học: </strong>
                                        </div>
                                        <div className="w-1/2 py-1">{classInfo.time}</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="w-1/2 py-1 text-right border-r">
                                            <strong>Học phí: </strong>
                                        </div>
                                        <div className="w-1/2 py-1">{classInfo.fee}</div>
                                    </div>
                                </div>
                                <NavLink
                                    to={user ? '/academy/skilles' : '/login'}
                                    className="flex justify-center text-center px-4 mx-auto mb-4"
                                >
                                    <button className="bg-primary py-3 px-5 rounded-3xl text-whiter hover:bg-secondary no-underline">
                                        Tham gia ngay
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Classes;
