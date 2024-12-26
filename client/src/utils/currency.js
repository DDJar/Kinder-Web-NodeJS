const formatCurrencyVN = (value) => {
    let format;
    format = new Intl.NumberFormat('vi-VI', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
    return format;
};

exports.formatCurrencyVN = formatCurrencyVN;
