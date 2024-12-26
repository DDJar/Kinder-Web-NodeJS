import { LinkBackwardIcon, Relieved01Icon, Sad01Icon } from 'hugeicons-react';
import React, { useState } from 'react';
import Button from '~/components/Button';
import Img1 from '~/images/user/user-01.png';
const sampleChildren = {
    idChild: 'De1600',
    childName: 'Bùi Tuấn Dũng',
    img: Img1,
    class: 'SE17A01',
    dateOB: '2019-05-15',
};
const CommentChild = () => {
    const [contentComment, setContentComment] = useState('');
    const [error, setError] = useState('');
    const handleTabPress = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    };
    const handleInputChange = (value) => {
        setContentComment(value);
        if (value.length < 6 || value.length > 100) {
            setError('Độ dài nhận xét phải từ 6 đến 100 ký tự.');
        } else {
            setError('');
        }
    };
    const handleSave = () => {
        if (!error) {
            alert('Nhận xét đã được lưu: ' + contentComment);
        }
    };

    return (
        <div className="container">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
                <div className=" w-full flex  mt-3 border rounded-lg overflow-hidden ">
                    <div className=" w-60  mr-3 border  ">
                        <div className="flex flex-col items-center p-10 mt-10 bg-white">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4">
                                <img src={sampleChildren.img} alt="" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{sampleChildren.childName}</p>
                                <p className="text-gray-500">ID: @De1600</p>
                                <p className="mt-2 text-blue-500">Lớp: {sampleChildren.class}</p>
                            </div>
                        </div>
                    </div>
                    <div className=" w-10/12 ">
                        <div className="flex flex-col justify-center p-4 ">
                            <div className="text-center font-bold  mb-2 text-title-lg">Nhận xét về học sinh</div>
                            {error && <p className="text-red-500 ml-2">{error}</p>}
                            <div className="space-y-2">
                                <textarea
                                    className="w-full min-h-60 text-lg p-2 outline-none focus:shadow-outline transition-transform transform translate-x-1 translate-y-1"
                                    placeholder="Ghi nhận xét ở đây......"
                                    onKeyDown={handleTabPress}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b space-x-2">
                                <Button success onClick={handleSave} icon={<Relieved01Icon />} roundedMd>
                                    Lưu
                                </Button>
                                <Button error icon={<Sad01Icon />} roundedMd>
                                    Không
                                </Button>
                                <Button info icon={<LinkBackwardIcon />} roundedMd>
                                    Trở về
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentChild;
