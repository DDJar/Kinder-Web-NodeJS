import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ArrowDown01Icon } from 'hugeicons-react';

// eslint-disable-next-line no-unused-vars
const PopoverComp = ({ button, notifying = false, children, title, right, left, onClick, iconRight }) => {
    let position = '';
    position = right ? '-right-0' : position;
    // eslint-disable-next-line no-unused-vars
    position = left ? '-left-0' : position;
    let props = {
        onClick,
    };
    return (
        <div className="relative m-0">
            <Popover className="relative mb-0">
                <PopoverButton
                    {...props}
                    className="group relative flex items-center justify-center focus:outline-none focus:border-none mb-0"
                >
                    <span
                        className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-error ${
                            notifying === false ? 'hidden' : 'inline'
                        }`}
                    >
                        <span className="absolute -z-1 inline-flex right-0 h-full w-full animate-ping rounded-full bg-meta-1 "></span>
                    </span>
                    {button}
                    {iconRight ? <ArrowDown01Icon /> : ''}
                </PopoverButton>

                <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <PopoverPanel
                        className={`absolute ${position} min-w-59 z-10 mt-3  rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5`}
                    >
                        <div className="px-4.5 py-1 ">
                            <h4 className="text-lg font-medium text-bodydark2">{title}</h4>
                        </div>
                        <div className="px-4 py-1">{children}</div>
                    </PopoverPanel>
                </Transition>
            </Popover>
        </div>
    );
};

export default PopoverComp;
