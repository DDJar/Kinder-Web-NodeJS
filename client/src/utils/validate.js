export function validateInputRequire(_input, _minLength, _maxLength) {
    _input = _input.trim();
    if (!_input) {
        return 'Trường này bắt buộc!!!';
    }
    if (_minLength && _maxLength && (_input.length < _minLength || _input.length > _maxLength)) {
        return `Số lượng kí tự thuộc khoảng ${_minLength} - ${_maxLength}`;
    }
    return '';
}

export function validateRange(_input, _min, _max) {
    if (typeof _input !== 'number') {
        _input = _input?.trim();
    }
    if (!_input) {
        return 'Trường này bắt buộc!!!';
    }
    if (_min && _input < _min) {
        return `Số phải lớn hơn ${_min}`;
    }
    if (_max && _input > _max) {
        return `Số phải nhỏ hơn ${_max}`;
    }
    return '';
}

export function reget(_value) {
    let valueArray = _value.split(' ');
    if (
        valueArray.length >= 2 &&
        valueArray[valueArray.length - 1] === valueArray[valueArray.length - 2] &&
        valueArray[valueArray.length - 2] === ''
    ) {
        valueArray.pop();
    }

    //upperCase
    let valueArrayUpperCase = valueArray.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return valueArrayUpperCase.join(' ');
}
