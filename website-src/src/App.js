import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Landing from './components/pages/Landing';
// import AboutUs from './components/pages/AboutUs';
// import Services from './components/pages/Services';
// import Career from './components/pages/Career';
// import ContactUS from './components/pages/ContactUS';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Fragment, default as React } from 'react'
import ScrollToTopBtn from "../src/components/common/ScrollToTop";
import AnimatedCursor from "react-animated-cursor"


function App() {
  return (
    <div className="App">
      <AnimatedCursor innerSize={12} outerSize={20} color='219,182,60' outerAlpha={0.6} innerScale={0.7} outerScale={2} />
      <Header />
      <BrowserRouter>
      <Routes>
        <Fragment>
          <Route path="/" element={<Landing />}></Route>
          {/* <Route path="/about" exact component={AboutUs} />
          <Route path="/services" exact component={Services} />
          <Route path="/career" exact component={Career} />
          <Route path="/contact" exact component={ContactUS} /> */}
        </Fragment>
      </Routes>
      </BrowserRouter>
      <Footer />
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
