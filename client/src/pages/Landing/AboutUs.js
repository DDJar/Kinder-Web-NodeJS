import React from 'react';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const AboutUs = () => {
    const { isLogin } = useUserProvider();
    console.log(isLogin);
    return (
        <div className=" py-5">
            <div className="container">
                <div className="flex items-center space-x-4">
                    <div className="w-full lg:w-2/5 mb-5 lg:mb-0 flex-1">
                        <img className="w-full/2 rounded-lg" src="img/about-1.jpg" alt="" />
                    </div>
                    <div className="w-full flex-1">
                        <p className="text-primary pr-5">
                            <span className="pr-2">Tìm hiểu về chúng tôi</span>
                        </p>
                        <h1 className="mb-4">Trường Tốt Nhất Cho Trẻ Em Của Bạn</h1>
                        <p>
                            Chào mừng đến với KindergartenABC, nơi chúng tôi không chỉ tập trung vào kiến thức mà còn
                            quan tâm đến sự phát triển toàn diện của trẻ. Với đội ngũ giáo viên giàu kinh nghiệm, chúng
                            tôi mang đến cho các bé một môi trường học tập sáng tạo, an toàn và vui vẻ.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
