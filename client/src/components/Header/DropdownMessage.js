import { useState } from 'react';

import { truncateString } from '~/utils/message';
import { formatCreatedAt } from '~/utils/time';

import { messages } from '~/testValue/user';
import PopoverComp from '../Popover';
import Button from '~/components/Button';
import { BubbleChatIcon } from 'hugeicons-react';

const DropdownMessage = () => {
    const [notifying, setNotifying] = useState(true);
    function handleOpen() {
        setNotifying(false);
    }
    return (
        <PopoverComp
            button={<Button outlineInfo icon={<BubbleChatIcon size={18} />}></Button>}
            notifying={notifying}
            title="Messages"
            right
            onClick={handleOpen}
        >
            {messages.map((message) => (
                <div
                    key={message._id}
                    className="group relative flex  w-100 items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <span className="h-10 w-10 rounded-full mr-2">
                            <img src={message.user.avatar} alt="User" />
                        </span>
                    </div>
                    <div className="flex-auto">
                        <a href="{item.href}" className="block font-semibold text-gray-900">
                            {message.user.lastName} {message.user.firstName}
                            <span className="absolute inset-0" />
                        </a>
                        <div className="flex justify-between">
                            <p className="mt-1 text-gray-600 ">{truncateString(message.content, 30)}</p>
                            <p className="mt-1 text-gray-600 ">{formatCreatedAt(message.createdAt)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </PopoverComp>
    );
};

export default DropdownMessage;
