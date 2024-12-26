import React, { useState } from 'react';

const EditAnnoucementPopup = ({ annoucements, onSave, onClose }) => {
    const [editingAnnoucement, setEditingAnnoucement] = useState({
        title: annoucements.title,
        content: annoucements.content,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingAnnoucement((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editingAnnoucement); // Call onSave function passed as prop
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-lg font-bold mb-2">Chỉnh sửa thông báo</h2>
                <label className="block mb-2">
                    Tiêu đề:
                    <input
                        type="text"
                        name="title"
                        value={editingAnnoucement.title}
                        onChange={handleChange}
                        className="border p-1 rounded-md w-full"
                    />
                </label>
                <label className="block mb-2">
                    Nội dung:
                    <textarea
                        name="content"
                        value={editingAnnoucement.content}
                        onChange={handleChange}
                        className="border p-1 rounded-md w-full"
                    />
                </label>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                    >
                        Lưu
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAnnoucementPopup;
