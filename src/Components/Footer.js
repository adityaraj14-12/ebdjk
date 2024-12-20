import React from 'react';
import './Footer.css'; // Import Footer styles
 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-socials">
          <h3>Follow us:</h3>
          <ul className="social-icons">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="https://static.vecteezy.com/system/resources/previews/016/716/481/non_2x/facebook-icon-free-png.png" alt="Facebook" /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="https://dreamfoundry.org/wp-content/uploads/2018/12/instagram-logo-png-transparent-background.png" alt="Instagram" /></a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="https://iconape.com/wp-content/files/cm/286303/svg/youtube-icon-logo-logo-icon-png-svg.png" alt="YouTube" /></a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src="https://www.targetedemaildatabase.com/wp-content/uploads/2021/08/1409937.png" alt="Twitter" /></a></li>
          </ul>
        </div>
 
        <div className="footer-contact">
          <h3>Contact Us:</h3>
          <p>Phone: 123-456-7890</p>
          <p>Email: support@elitecarrental.com</p>
        </div>
 
        <div className="footer-app-download">
          <h3>Download Our App:</h3>
          <div className="app-links">
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src="https://icon-library.com/images/app-store-icon-png/app-store-icon-png-14.jpg" alt="App Store" />
            </a>
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <img src="https://www.simplisubscribe.com/media/uds_assets/playstore@3x.png" alt="Google Play" />
            </a>
          </div>
        </div>
      </div>
 
      <p className="footer-bottom-text">© 2024 Elite Car Rental. All rights reserved.</p>
    </footer>
  );
};
 
export default Footer;