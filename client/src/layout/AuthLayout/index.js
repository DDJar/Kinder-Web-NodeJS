import Header from './Header';

function AuthLayout({ children }) {
    return (
        <div>
            <Header />
            <div className="content"> {children} </div>
        </div>
    );
}

export default AuthLayout;
