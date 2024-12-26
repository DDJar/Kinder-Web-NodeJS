import { Home01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import PopoverComp from '~/components/Popover';
import { messages } from '~/testValue/user';
import { truncateString } from '~/utils/message';
import { formatCreatedAt } from '~/utils/time';

function PopoverCompTemplate() {
    return (
        <div className="flex justify-around mt-30">
            <div>PopoverCompTemplate</div>
            <PopoverComp
                button={<Button outlineInfo icon={<Home01Icon />}></Button>}
                notifying={true}
                title="Test Popover"
                right
            >
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
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
        </div>
    );
}

export default PopoverCompTemplate;
