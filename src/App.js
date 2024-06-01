import logo from './logo.svg';
import './App.css';
import './css/navbar.style.css'
import './css/homePage.style.css'
import './css/cartPage.style.css'
import './css/notifBox.style.css'
import './css/searchPage.style.css'
import './css/productPage.style.css'
import './css/utils.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'remixicon/fonts/remixicon.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Home } from './components/pages/homePage';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/pages/navBar';
import { Footer } from './components/pages/footer';
import { CartPage } from './components/pages/cartPage';
import { SearchResultPage } from './components/pages/searchResultPage';
import { ProductPage } from './components/pages/productPage';
import { ErrorPage } from './components/pages/errorPage';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='search' element={<SearchResultPage />} />
          <Route path='product' element={<ProductPage />} />
          <Route path='*' element={<ErrorPage />} />

        </Routes>
      </main>
      {location.pathname !== 'cart' &&
        <footer>
          <Footer />
        </footer>}
    </>
  );
}

export default App;
