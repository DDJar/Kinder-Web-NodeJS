import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useParamByKey(_key) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [param, setParam] = useState(queryParams.get(_key));

    const _setParam = useCallback(
        (_value) => {
            if (_value) {
                navigate(`${location.pathname}?${_key}=${_value}`, { replace: true });
            } else {
                navigate(`${location.pathname}`, { replace: true });
            }
            setParam(_value);
        },
        [navigate, location.pathname, _key],
    );

    return [param, _setParam];
}

export default useParamByKey;
