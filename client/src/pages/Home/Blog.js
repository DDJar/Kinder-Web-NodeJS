import { Comment01Icon, Folder01Icon, UserSharingIcon } from 'hugeicons-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const blogs = [
    {
        img: 'img/blog-1.jpg',
        title: 'Diam amet eos at no eos',
        iconAuthor: <UserSharingIcon className="size-6 text-primary" />,
        iconCategory: <Folder01Icon className="size-6 text-primary" />,
        iconComments: <Comment01Icon className="size-6 text-primary" />,
        author: 'Admin',
        category: 'Web Design',
        comments: 15,
        description:
            'Sed kasd sea sed at elitr sed ipsum justo, sit nonumy diam eirmod, duo et sed sit eirmod kasd clita tempor dolor stet lorem. Tempor ipsum justo amet stet...',
        link: '#',
    },
    {
        img: 'img/blog-2.jpg',
        title: 'Diam amet eos at no eos',
        iconAuthor: <UserSharingIcon className="size-6 text-primary" />,
        iconCategory: <Folder01Icon className="size-6 text-primary" />,
        iconComments: <Comment01Icon className="size-6 text-primary" />,
        author: 'Admin',
        category: 'Web Design',
        comments: 15,
        description:
            'Sed kasd sea sed at elitr sed ipsum justo, sit nonumy diam eirmod, duo et sed sit eirmod kasd clita tempor dolor stet lorem. Tempor ipsum justo amet stet...',
        link: '#',
    },
    {
        img: 'img/blog-3.jpg',
        title: 'Diam amet eos at no eos',
        iconAuthor: <UserSharingIcon className="size-6 text-primary" />,
        iconCategory: <Folder01Icon className="size-6 text-primary" />,
        iconComments: <Comment01Icon className="size-6 text-primary" />,
        author: 'Admin',
        category: 'Web Design',
        comments: 15,
        description:
            'Sed kasd sea sed at elitr sed ipsum justo, sit nonumy diam eirmod, duo et sed sit eirmod kasd clita tempor dolor stet lorem. Tempor ipsum justo amet stet...',
        link: '#',
    },
];

const Blog = () => {
    return (
        <div className="container-fluid pt-5">
            <div className="container">
                <div className="text-center pb-2">
                    <p className="section-title px-5">
                        <span className="px-2">Latest Blog</span>
                    </p>
                    <h1 className="mb-4">Latest Articles From Blog</h1>
                </div>
                <div className="flex flex-wrap -mx-3 pb-3">
                    {blogs.map((blog, index) => (
                        <div key={index} className="w-full lg:w-1/3 px-3 mb-4">
                            <div className="card border-0 shadow-sm mb-2">
                                <img className="card-img-top mb-2" src={blog.img} alt={blog.title} />
                                <div className="card-body bg-gray-100 text-center p-4">
                                    <h4 className="">{blog.title}</h4>
                                    <div className="flex justify-center mb-3">
                                        <small className="mr-3 flex items-center">
                                            {blog.iconAuthor} {blog.author}
                                        </small>
                                        <small className="mr-3 flex items-center">
                                            {blog.iconCategory} {blog.category}
                                        </small>
                                        <small className="mr-3 flex items-center">
                                            {blog.iconComments} {blog.comments}
                                        </small>
                                    </div>
                                    <p>{blog.description}</p>
                                    <NavLink
                                        href={blog.link}
                                        className="flex justify-center text-center px-4 mx-auto mt-4"
                                    >
                                        <button className="bg-primary py-3 px-5 rounded-3xl text-whiter hover:bg-secondary no-underline">
                                            Read More
                                        </button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
