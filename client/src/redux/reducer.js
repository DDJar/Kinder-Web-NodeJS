import Cookies from 'js-cookie';
import { childrenInitialState } from '~/testValue/user';

const initialState = {
    user: {
        avatar: '',
        role: '',
        address: '',
        _id: '',
        firstName: '',
        lastName: '',
    },
    children: childrenInitialState,
    // Thêm các trạng thái khác nếu cần
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            Cookies.set('userInfor', JSON.stringify(action.payload), { expires: 7 });
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_CHILDREN':
            return {
                ...state,
                children: action.payload,
            };
        // Các case khác nếu cần
        default:
            return state;
    }
};

export default reducer;
