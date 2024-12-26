import { toast } from 'react-toastify';

const toastPromis = (title, _function) => {
    toast.promise(_function, {
        pending: {
            render() {
                return `${title}...`;
            },
        },
        success: {
            render() {
                return `${title} thành công!`;
            },
            // other options
            icon: '🟢',
        },
        error: {
            render({ data }) {
                // When the promise reject, data will contains the error
                return (
                    <div>
                        {`${title} thất bại!`}
                        <br />
                        {data.message}
                    </div>
                );
            },
        },
    });
};
export default toastPromis;
