import { useState } from 'react';
import Button from '~/components/Button';
import Modal from '~/components/Modal';

function ModalTemplate() {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleShowAlert = () => {
        window.alert('Accept');
    };
    return (
        <div>
            <h1>Dialogs page</h1>
            <Button primary onClick={toggleModal}>
                Show Modal
            </Button>
            <Modal
                title={'regist account'}
                _showModal={showModal}
                onClick={toggleModal}
                onClickAccept={handleShowAlert}
            >
                Hãy đăng nhập gì đó đi?
            </Modal>
        </div>
    );
}

export default ModalTemplate;
