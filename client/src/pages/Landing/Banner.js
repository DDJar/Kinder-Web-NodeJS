import React from 'react';

const Banner = () => {
    return (
        <div className="container-fluid bg-primary px-0 md:px-5 mb-5">
            <div className="flex items-center px-3">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h4 className="text-white mb-4 mt-5 lg:mt-0">Môi trường Học Tập Cho Trẻ Em</h4>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        Cách Tiếp Cận Mới Trong Giáo Dục Trẻ Em
                    </h1>
                </div>
                <div className="lg:w-1/2 text-center lg:text-right">
                    <img className="img-fluid my-5" src="img/header.png" alt="ádasd" />
                </div>
            </div>
        </div>
    );
};

export default Banner;
