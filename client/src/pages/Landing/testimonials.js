import React from 'react';

const testimonials = [
    {
        text: 'Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum clita',
        img: 'img/testimonial-1.jpg',
        name: 'Parent Name',
        profession: 'Profession',
    },
    {
        text: 'Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum clita',
        img: 'img/testimonial-2.jpg',
        name: 'Parent Name',
        profession: 'Profession',
    },
    {
        text: 'Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum clita',
        img: 'img/testimonial-3.jpg',
        name: 'Parent 2',
        profession: 'Profession',
    },
    {
        text: 'Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum clita',
        img: 'img/testimonial-4.jpg',
        name: 'Parent Name',
        profession: 'Profession',
    },
];

const Testimonial = () => {
    return (
        <div className=" py-5">
            <div className=" p-0">
                <div className="text-center pb-2">
                    <p className="section-title px-5">
                        <span className="px-2">Testimonial</span>
                    </p>
                    <h1 className="mb-4">What Parents Say!</h1>
                </div>
                <div className="testimonial-carousel flex">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-item px-3">
                            <div className="bg-gray-100 shadow-sm rounded mb-4 p-4 flex">{testimonial.text}</div>
                            <div className="flex items-center">
                                <img
                                    className="rounded-full"
                                    src={testimonial.img}
                                    style={{ width: '70px', height: '70px' }}
                                    alt="Testimonial"
                                />
                                <div className="pl-3">
                                    <h5>{testimonial.name}</h5>
                                    <i>{testimonial.profession}</i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
