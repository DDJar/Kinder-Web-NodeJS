import axios from 'axios';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { _getUsers } from '~/api/user';
import { toastError, toastInfo, toastSuccess, toastWarn } from '~/common/Toastify/toastCommon';
import toastPromis from '~/common/Toastify/toastPromis';
import Button from '~/components/Button';

function ToastTemplate() {
    //example I get all User
    const [users, setUsers] = useState();
    const getUsers = async () => {
        // eslint-disable-next-line no-unused-vars
        let data = await axios({
            method: _getUsers.method,
            url: _getUsers.url,
            data: {
                lastName: 'Lý',
                firstName: 'Thường Kiệt',
            },
        });
        //ex: get 2 user
        data = [{ userName: 'hoang ý' }, { userName: 'Quốc Việt' }];
        setUsers(data);
        return users;
    };

    return (
        <div className="m-4 space-x-4 flex">
            <Button primary onClick={() => toastPromis('Query users', getUsers)}>
                Toast Promis get all users
            </Button>
            <Button outlinePrimary onClick={() => toastSuccess('.....thành công')}>
                Toast success
            </Button>
            <Button primary onClick={() => toastWarn('.....cảnh báo')}>
                Toast warn
            </Button>
            <Button outlinePrimary onClick={() => toastInfo('.....thông tin')}>
                Toast info
            </Button>
            <Button secondary onClick={() => toastError('.....thất bại')}>
                Toast error
            </Button>
            {/* <ToastContainer /> */}
        </div>
    );
}
export default ToastTemplate;
