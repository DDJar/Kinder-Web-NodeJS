import { toast } from 'react-toastify';

const toastSuccess = (title) => {
    toast.success(title, { position: 'top-right' });
};
const toastError = (title) => {
    toast.error(title, { position: 'top-right' });
};
const toastWarn = (title) => {
    toast.warn(title, { position: 'top-right' });
};
const toastInfo = (title) => {
    toast.info(title, { position: 'top-right' });
};

export { toastSuccess, toastError, toastWarn, toastInfo };
