import PageTitle from '~/common/PageTitle';
import Classes from './Classes';
import AboutUs from './AboutUs';
import Facilities from './Facilities';
import Banner from './Banner';
// import Team from './Team';
// import Testimonial from './testimonials';
// import Blog from './Blog';
import React from 'react';
function LandingPage() {
    return (
        <>
            <PageTitle title="Kindergarten" />
            {/* header */}
            <Banner />
            <div className="mx-30">
                {/*End header */}
                {/* <!-- Facilities Start -->*/}
                <Facilities />
                {/* <!-- Facilities Start -->*/}
                {/* <!-- About Start --> */}
                <AboutUs />
                {/* <!-- About Start --> */}
                <Classes />
                {/* <Registration /> */}
                {/* <Team /> */}
                {/* <Testimonial /> */}
                {/* <Blog /> */}
            </div>
        </>
    );
}

export default LandingPage;
