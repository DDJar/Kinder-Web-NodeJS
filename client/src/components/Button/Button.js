import { Link } from 'react-router-dom';

const Button = ({
    children,
    primary,
    secondary,
    outlinePrimary,
    outlineSecondary,
    success,
    outlineSuccess,
    error,
    outlineError,
    info,
    outlineInfo,
    text,
    target = '_blank',
    disable = false,
    onClick,
    icon,
    small,
    roundedMd,
    large,
    className,
    to,
    href,
    loading = false,
    ...passProps
}) => {
    let Comp = 'button';
    let font = 'font-medium ';
    let spacing = 'py-3 px-10';
    let typeButton = '';
    let _rounded = 'rounded-full';
    _rounded = roundedMd ? 'rounded-md' : 'rounded-full';
    // check isOnly icon
    // if only icon then border circle
    spacing = children ? spacing : 'p-2';

    spacing = children && icon ? 'py-3 pl-7 pr-10' : spacing;
    spacing = text ? 'p-2' : spacing;

    if (small) {
        font = 'font-light';
        spacing = 'p-1';
    }

    typeButton = primary ? `bg-primary text-white  ` : typeButton;
    typeButton = secondary ? ' bg-secondary text-white' : typeButton;
    typeButton = error ? ' bg-error text-white' : typeButton;
    typeButton = success ? ' bg-success text-white' : typeButton;
    typeButton = info ? ' bg-info text-white' : typeButton;

    typeButton = outlinePrimary ? ' border border-primary text-primary' : typeButton;
    typeButton = outlineSecondary ? ' border border-secondary text-secondary' : typeButton;
    typeButton = outlineError ? ' border border-error text-error' : typeButton;
    typeButton = outlineSuccess ? ' border border-success text-success' : typeButton;
    typeButton = outlineInfo ? ' border border-info text-info' : typeButton;

    typeButton = text ? 'text-info hover:underline' : typeButton;

    const props = {
        disabled: disable,
        onClick,
        ...passProps,
    };
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }
    if (loading) {
        props.disabled = true;
    }

    return (
        <Comp
            target={target}
            className={` ${typeButton} ${font} ${spacing} ${className} ${_rounded} ${large ? 'w-full' : ''} ${outlineInfo ? 'hover:text-primary hover:border-primary' : ''} flex align-middle justify-center select-none hover:bg-opacity-80 ${disable ? 'pointer-events-none cursor-not-allowed bg-opacity-50' : ''}`}
            {...props}
            disabled={disable ? disable : false}
        >
            {icon && !loading && <span className={`${children ? 'mr-2' : ''}`}>{icon}</span>}
            <span>{children}</span>
            {loading && <span>Wait</span>}
        </Comp>
    );
};
export default Button;
