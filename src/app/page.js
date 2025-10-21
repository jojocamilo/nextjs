// src/Pages/Home/Home.jsx
import React from 'react';
import PortfolioCarousel from './components/PortfolioCarousel/PortfolioCarousel';
// import Skills from './components/Skills/Skills';
import CallToAction from './components/CallToAction/CallToAction';
// import AboutMe from './components/AboutMe/AboutMe';
import Features from './components/Features/Features';
import CompanyCarousel from './components/CompanyCarousel/CompanyCarousel.jsx';
// import TextCarousel from './components/TextCarousel/TextCarousel';
// import CustomModel from "./components/CustomModel/CustomModel";
import './styles/home-page.css'; // nur für home
// import FeaturesInteractive from './components/FeatureInteractive/FeaturesInteractive';
// import TestimonialsGrid from './components/TestimonialsGrid/TestimonialsGrid';

// 1. Impor komponen Countdown yang baru
import Countdown from './components/Countdown/Countdown';
// import ConferenceSchedule from './components/ConferenceSchedule/ConferenceSchedule';
import Guidelines from './components/Guidelines/Guidelines';
import ImportantDates from './components/ImportantDates/ImportantDates'; // 1. Impor
import TopicExplorer from './components/TopicExplorer/TopicExplorer'; // 1. Impor
import AboutConference from './components/AboutConference/AboutConference';

import ContactBanner from './components/ContactBanner/ContactBanner'; // 1. Ganti nama import
const Home = () => {
  return (
    <div className="page home-page">
      <PortfolioCarousel />
            {/* <TestimonialsGrid /> */}
      <CompanyCarousel />
      <CallToAction />
      <AboutConference />

      {/* 2. Selipkan komponen di sini */}
      <Countdown />
      <Features />
      <Guidelines />
      <ImportantDates />
      <TopicExplorer />
      <ContactBanner />
      {/* <FeaturesInteractive /> */}
      {/* <ConferenceSchedule /> */}

    </div>
  );
};

export default Home;