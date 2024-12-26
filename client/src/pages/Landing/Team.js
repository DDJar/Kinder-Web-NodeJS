import React from 'react';

const Team = () => {
    const teachers = [
        {
            img: 'img/team-1.jpg',
            name: 'Julia Smith',
            title: 'Music Teacher',
            social: [
                { platform: 'twitter', url: '#' },
                { platform: 'facebook-f', url: '#' },
                { platform: 'linkedin-in', url: '#' },
            ],
        },
        {
            img: 'img/team-2.jpg',
            name: 'John Doe',
            title: 'Language Teacher',
            social: [
                { platform: 'twitter', url: '#' },
                { platform: 'facebook-f', url: '#' },
                { platform: 'linkedin-in', url: '#' },
            ],
        },
        {
            img: 'img/team-3.jpg',
            name: 'Mollie Ross',
            title: 'Dance Teacher',
            social: [
                { platform: 'twitter', url: '#' },
                { platform: 'facebook-f', url: '#' },
                { platform: 'linkedin-in', url: '#' },
            ],
        },
        {
            img: 'img/team-4.jpg',
            name: 'Donald John',
            title: 'Art Teacher',
            social: [
                { platform: 'twitter', url: '#' },
                { platform: 'facebook-f', url: '#' },
                { platform: 'linkedin-in', url: '#' },
            ],
        },
    ];

    return (
        <div className="container-fluid pt-5">
            <div className="container">
                <div className="text-center pb-2">
                    <p className="section-title px-5">
                        <span className="px-2">Our Teachers</span>
                    </p>
                    <h1 className="mb-4">Meet Our Teachers</h1>
                </div>
                <div className="flex flex-wrap -mx-3">
                    {teachers.map((teacher, index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-3 mb-5 text-center">
                            <div className="relative overflow-hidden mb-4" style={{ borderRadius: '100%' }}>
                                <img className="img-fluid w-full" src={teacher.img} alt={teacher.name} />
                                <div className="team-social flex items-center justify-center w-full h-full absolute top-0 left-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
                                    {teacher.social.map((social, index) => (
                                        <a
                                            key={index}
                                            className="btn btn-outline-light text-center mx-1"
                                            style={{ width: '38px', height: '38px' }}
                                            href={social.url}
                                        >
                                            <i className={`fab fa-${social.platform}`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <h4>{teacher.name}</h4>
                            <i>{teacher.title}</i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
