import { CallIcon, Location01Icon, Mail01Icon, StarIcon } from 'hugeicons-react';
import { NavLink } from 'react-router-dom';

function Footer() {
    return (
        <div className="px-10 bg-secondary text-white py-5 px-sm-3 px-md-5 max-h-150">
            <div className="flex pt-5 space-x-6">
                <div className="mb-5 flex-1">
                    <NavLink
                        to="/"
                        className="navbar-brand font-weight-bold text-primary m-0 mb-4 p-0 flex justify-start"
                        style={{ fontSize: '40px', lineHeight: '40px' }}
                    >
                        <img src="/logo.png" width={100} alt="logo"></img>
                    </NavLink>
                    <p>
                        Tại Trường Mẫu Giáo ABC, chúng tôi cam kết mang đến cho trẻ một môi trường học tập đầy cảm hứng,
                        an toàn và thân thiện. Với triết lý giáo dục hiện đại, chúng tôi không chỉ cung cấp kiến thức mà
                        còn tập trung phát triển toàn diện về mặt tư duy, kỹ năng xã hội, và sức khỏe tinh thần cho các
                        bé.
                    </p>
                    <div className="flex justify-content-start mt-4">
                        <NavLink
                            className="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
                            style={{ width: '38px', height: '38px' }}
                            to="#"
                        >
                            <StarIcon className="size-6" />
                        </NavLink>
                        <NavLink
                            className="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
                            style={{ width: '38px', height: '38px' }}
                            to="#"
                        >
                            <StarIcon className="size-6" />
                        </NavLink>
                        <NavLink
                            className="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
                            style={{ width: '38px', height: '38px' }}
                            to="#"
                        >
                            <StarIcon className="size-6" />
                        </NavLink>
                        <NavLink
                            className="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
                            style={{ width: '38px', height: '38px' }}
                            to="#"
                        >
                            <StarIcon className="size-6" />
                        </NavLink>
                        <NavLink
                            className="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
                            style={{ width: '38px', height: '38px' }}
                            to="#"
                        >
                            <StarIcon className="size-6" />
                        </NavLink>
                    </div>
                </div>
                <div className=" mb-5 flex-1">
                    <h3 className="text-primary mb-4 ">Liên hệ với chúng tôi</h3>
                    <div className="flex">
                        <h4 className="fa fa-map-marker-alt text-primary">
                            <Location01Icon className="size-6" />
                        </h4>
                        <div className="pl-3">
                            <h5 className="text-white">Địa chỉ: </h5>
                            <p>123 Đường ABC, Thành phố XYZ, Việt Nam</p>
                        </div>
                    </div>
                    <div className="flex">
                        <h4 className="fa fa-envelope text-primary">
                            <Mail01Icon className="size-6" />
                        </h4>
                        <div className="pl-3">
                            <h5 className="text-white">Email</h5>
                            <p>info@example.com</p>
                        </div>
                    </div>
                    <div className="flex">
                        <h4 className="fa fa-phone-alt text-primary">
                            <CallIcon className="size-6" />
                        </h4>
                        <div className="pl-3">
                            <h5 className="text-white">Số điện thoại: </h5>
                            <p>+84 345 67890</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid pt-5 flex justify-center border-t-2 border-cyan-600">
                <p className="m-0 text-center text-white flex justify-center">
                    &copy;{' '}
                    <NavLink className="text-primary font-weight-bold" to="#">
                        Kindergarten
                    </NavLink>
                    . All Rights Reserved. Designed by
                    <NavLink className="text-primary font-weight-bold" to="https://htmlcodex.com">
                        {' '}
                        KinderTeam
                    </NavLink>
                </p>
            </div>
        </div>
    );
}

export default Footer;
