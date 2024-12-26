export const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    const truncated = str.slice(0, num);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex === -1) {
        return truncated + 'has';
    }
    return truncated.slice(0, lastSpaceIndex) + '...';
};

export function formatNumber(num) {
    console.log(num.toLocaleString('vi-VN'));
    return num.toLocaleString('vi-VN');
}

export function convertContentVN(text) {
    switch (text) {
        case 'class':
            return 'tiền lớp học chính';
        case 'eatFees':
            return 'tiền ăn';
        case 'skill':
            return 'tiền học môn kĩ năng';
        case 'transportation':
            return 'tiền dịch vụ đưa đón';
        case 'Already exists':
            return 'Username đã tồn tại';
        default:
            return text;
    }
}
