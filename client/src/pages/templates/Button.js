import { Cancel01Icon, Home01Icon, LinkBackwardIcon, Relieved01Icon, Sad01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
function ButtonTemplate() {
    const handleAlert = () => {
        window.alert('Hello ');
    };
    return (
        <div className="mx-30">
            <h1>Butoons teamplate</h1>
            <h4>Normal button</h4>
            <div className="flex space-x-4">
                <Button primary>primary </Button>
                <Button secondary>secondary </Button>
                <Button outlinePrimary>outlinePrimary </Button>
                <Button outlineSecondary>outlineSecondary </Button>
                <Button outlineError>outlineSecondary </Button>
                <Button outlineSuccess>outlineSecondary </Button>
            </div>
            {/* ================================================ */}
            <h4>Icon button </h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />}>
                    primary
                </Button>
                <Button secondary icon={<Home01Icon />}>
                    secondary
                </Button>
                <Button outlinePrimary icon={<Home01Icon />}>
                    outlinePrimary
                </Button>
                <Button outlineSecondary icon={<Home01Icon />}>
                    outlineSecondary
                </Button>
            </div>
            {/* ================================================ */}
            <h4>Icon Only </h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />}></Button>
                <Button secondary icon={<Home01Icon />}></Button>
                <Button outlinePrimary icon={<Home01Icon />}></Button>
                <Button outlineSecondary icon={<Home01Icon />}></Button>
            </div>
            {/* ================================================ */}
            <h4>Rounded custom Only </h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />} roundedMd>
                    primary
                </Button>
                <Button secondary icon={<Home01Icon />} roundedMd>
                    secondary
                </Button>
                <Button outlinePrimary icon={<Home01Icon />} roundedMd>
                    outlinePrimary
                </Button>
                <Button outlineSecondary icon={<Home01Icon />} roundedMd>
                    outlineSecondary
                </Button>
            </div>

            {/* ================================================ */}
            <h4>Link button</h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />} to={'/home'}>
                    to
                </Button>
                <Button text to={'/'}>
                    text link
                </Button>
                <Button text href={'https://hugeicons.com/'}>
                    href link
                </Button>
            </div>
            {/* ================================================ */}
            <h4>Event button</h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />} onClick={handleAlert}>
                    click me!
                </Button>
                <Button primary icon={<Home01Icon />} onClick={handleAlert} disable={true}>
                    Disable !
                </Button>
            </div>
            {/* ================================================ */}
            <h4>Width large button</h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />} large>
                    Large
                </Button>
            </div>
            {/* ================================================ */}
            <h4>Width small button</h4>
            <div className="flex space-x-4">
                <Button primary icon={<Home01Icon />} small>
                    Small
                </Button>
                {/* Close Button */}
                <Button error icon={<Cancel01Icon />} small roundedMd></Button>
            </div>
            {/* ================================================ */}
            <h4>Others button</h4>
            <div className="flex space-x-4 justify-center items-center">
                <Button success icon={<Relieved01Icon />} roundedMd>
                    Yes
                </Button>
                <Button error icon={<Sad01Icon />} roundedMd>
                    No
                </Button>
                <Button info icon={<LinkBackwardIcon />} roundedMd>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default ButtonTemplate;
