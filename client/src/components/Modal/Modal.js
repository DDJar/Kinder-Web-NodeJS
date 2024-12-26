import { Cancel01Icon, LinkBackwardIcon } from 'hugeicons-react';
import React, { useEffect, useState } from 'react';
import Button from '~/components/Button';

const Modal = ({ title, children, _showModal, onClick, onClickAccept }) => {
    const [showModal, setShowModal] = useState(_showModal);
    useEffect(() => {
        setShowModal(_showModal);
    }, [_showModal]);

    return (
        <div className="App">
            {showModal && (
                <div
                    id="default-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                                <Button
                                    primary
                                    icon={<Cancel01Icon />}
                                    small
                                    onClick={onClick}
                                    className="rounded-md  bg-red-500"
                                ></Button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4 text-gray-500">{children}</div>
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b space-x-2">
                                <Button onClick={onClickAccept} primary className="rounded-md">
                                    Tiếp tục
                                </Button>

                                <Button
                                    onClick={onClick}
                                    primary
                                    icon={<LinkBackwardIcon />}
                                    className="rounded-md bg-slate-600"
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
