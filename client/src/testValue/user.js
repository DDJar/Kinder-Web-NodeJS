import UserOne from '~/images/user/user-01.png';
import UserTwo from '~/images/user/user-02.png';

export const loggedInUser = {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    avatar: UserOne,
    role: 'ADMIN',
};

export const ProfileUser = {
    _id: '1',
    firstName: 'Bùi',
    lastName: 'Tuấn Dũng',
    avatar: UserOne,
    address: '',
    phone: '',
    role: 'USER',
};

export const childrenInitialState = [];

//Xếp theo thời gian gần nhất
export const messages = [
    {
        _id: '1',
        user: {
            _id: '1',
            firstName: 'Tuyết',
            lastName: 'Nhi',
            avatar: UserOne,
        },
        content: 'Con tôi học giỏi giống như tôi  ',
        createdAt: '2024-01-29T15:49:45.653+00:00',
    },
    {
        _id: '2',
        user: {
            _id: '2',
            firstName: 'Hoàng Ý',
            lastName: 'Bùi',
            avatar: UserTwo,
        },
        content: 'Con tôi học giỏi điều không bàn cãi',
        createdAt: '2024-01-29T15:49:45.653+00:00',
    },
    {
        _id: '3',
        user: {
            _id: '2',
            firstName: 'Hoàng Ý',
            lastName: 'Bùi',
            avatar: UserTwo,
        },
        content: 'Con tôi học giỏi điều không bàn cãi',
        createdAt: '2024-05-31T15:49:45.653+00:00',
    },
];
export const notifications = [
    {
        user: {
            _id: '1',
            firstName: 'Tuyết',
            lastName: 'Nhi',
            avatar: UserOne,
        },
        content: 'đã đăng kí lớp học cho con',
        createdAt: '2024-01-29T15:49:45.653+00:00',
    },
    {
        _id: '2',
        user: {
            _id: '2',
            firstName: 'Hoàng Ý',
            lastName: 'Bùi',
            avatar: UserTwo,
        },
        content: 'đã đăng kí lớp kĩ năng cho con cho con hahaha',
        createdAt: '2024-01-29T15:49:45.653+00:00',
    },
    {
        _id: '3',
        user: {
            _id: '2',
            firstName: 'Hoàng Ý',
            lastName: 'Bùi',
            avatar: UserTwo,
        },
        content: 'đã tạo một Proposal mớI',
        createdAt: '2024-05-31T15:49:45.653+00:00',
    },
];
