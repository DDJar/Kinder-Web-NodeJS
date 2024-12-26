import { Cancel01Icon } from 'hugeicons-react';
import React, { useState, useEffect } from 'react';
import Button from '~/components/Button';

const Accordion = ({ key, title, image }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModalOnBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            toggleModal();
        }
    };

    useEffect(() => {
        if (image) {
            setImageUrl(image);
        } else {
            setImageUrl('');
        }
    }, [image]);

    return (
        <div key={key} className="border-gray-300">
            <Button className="flex pl-0" onClick={toggleAccordion}>
                <span className="font-bold">{title}</span>
                <span className="ml-2">{isOpen ? '-' : '+'}</span>
            </Button>
            {isOpen && (
                <div className="p-4">
                    {imageUrl ? (
                        <>
                            <Button onClick={toggleModal}>
                                <img src={imageUrl} alt={title} className="w-70 h-70  object-cover rounded-md" />
                            </Button>

                            {isModalOpen && (
                                <div
                                    id="default-modal"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    onClick={closeModalOnBackdropClick}
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                                >
                                    <div className="relative mt-7 p-4 w-full max-w-2xl max-h-[100vh] overflow-hidden">
                                        <div className="relative bg-slate-200 rounded-lg shadow dark:bg-gray-700 w-full h-full max-h-[100vh]">
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {title}
                                                </h3>
                                                <Button
                                                    primary
                                                    icon={<Cancel01Icon />}
                                                    small
                                                    onClick={toggleModal}
                                                    className="rounded-md bg-red-500"
                                                ></Button>
                                            </div>
                                            <div className="p-4 md:p-5 space-y-4 text-gray-500 overflow-y-auto max-h-[80vh]">
                                                <img
                                                    src={imageUrl}
                                                    alt={title}
                                                    className="w-full h-auto object-contain rounded-md mb-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-gray-500">Không có hình ảnh.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Accordion;
