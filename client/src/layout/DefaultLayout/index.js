import Footer from '~/components/Footer';
import Header from '~/components/Header';

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div>
                <div className="content bg-slate-100"> {children} </div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
