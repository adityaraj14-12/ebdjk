import React from 'react';
import './AboutUs.css'; // Importing the updated CSS for styling

function AboutUs() {
  return (
    <div id="about-us-container">
      <div id="about-header">
        <div id="header-title">
          <span id="title-text">Welcome to Gadi Chahiye</span>
        </div>
        <div id="header-description">
          <span id="description-text">Reliable, Affordable, and Comfortable Travel</span>
        </div>
      </div>

      <div id="about-section">
        <div id="about-text">
          <span id="about-heading">About Us</span>
          <p id="about-description">
            Gadi Chahiye is your trusted partner in car rentals, offering you a wide range of vehicles for every occasion. 
            Whether you're going on a business trip, family vacation, or a solo road trip, we provide affordable, reliable, 
            and comfortable travel options to meet your needs. Our fleet is well-maintained, and we ensure a hassle-free rental experience.
          </p>
        </div>
      </div>

      <div id="mission-section">
        <div id="mission-text">
          <span id="mission-heading">Our Mission</span>
          <p id="mission-description">
            Our mission is to make your travels stress-free and enjoyable. We aim to provide high-quality car rental services 
            at affordable prices. Whether you're traveling for business or leisure, we focus on delivering exceptional customer service, 
            reliability, and convenience every time you rent a car with us.
          </p>
        </div>
      </div>

      <div id="ratings-section">
        <div id="ratings-heading">
          <span id="ratings-title">Ratings from Our Trusted Partners</span>
        </div>
        <div id="ratings-logos">
          <div className="rating-logo">
            <img src="https://cdn.dribbble.com/users/1883283/screenshots/7604920/car_logo-01_4x.jpg" alt="Partner 1" />
            <div className="rating-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star-empty">☆</span>
            </div>
          </div>
          <div className="rating-logo">
            <img src="https://cdn.vectorstock.com/i/preview-1x/39/29/rental-car-logo-icon-vector-38403929.jpg" alt="Partner 2" />
            <div className="rating-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star-empty">☆</span>
              <span className="star-empty">☆</span>
            </div>
          </div>
          <div className="rating-logo">
            <img src="https://cdn.vectorstock.com/i/preview-1x/86/02/logo-for-car-rental-and-sales-vector-25468602.jpg" alt="Partner 3" />
            <div className="rating-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
          </div>
          <div className="rating-logo">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/c93992123993259.Y3JvcCwxMDgwLDg0NCwwLDY1Nw.png" alt="Partner 4" />
            <div className="rating-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star-empty">☆</span>
            </div>
          </div>
        </div>
      </div>

      <div id="team-section">
        <div id="team-heading">
          <span id="team-title">Meet the Team</span>
        </div>
        
        {/* Team Members in a Single Row (Flexbox Layout) */}
        <div id="team-members-container">
          {/* Team Member 1 */}
          <div className="team-member">
            <div className="team-member-img">
              <img src="https://pvcvinylflooring.ae/wp-content/uploads/2023/06/Leo-Blair.jpg" alt="Jane Smith" />
            </div>
            <div className="team-member-info">
              <span className="team-member-name">Deepak</span><br/>
              <span className="team-member-role">CEO</span>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="team-member">
            <div className="team-member-img">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="John Doe" />
            </div>
            <div className="team-member-info">
              <span className="team-member-name">Aditya</span><br/>
              <span className="team-member-role">Operational Manager</span>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="team-member">
            <div className="team-member-img">
              <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Michael Lee" />
            </div>
            <div className="team-member-info">
              <span className="team-member-name">Yashwant</span><br/>
              <span className="team-member-role">CTO</span>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="team-member">
            <div className="team-member-img">
              <img src="https://randomuser.me/api/portraits/women/4.jpg" alt="Sarah Turner" />
            </div>
            <div className="team-member-info">
              <span className="team-member-name">Hitesh</span><br/>
              <span className="team-member-role">Marketing Head</span>
            </div>
          </div>

          {/* Team Member 5 */}
          <div className="team-member">
            <div className="team-member-img">
              <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="David Clark" />
            </div>
            <div className="team-member-info">
              <span className="team-member-name">Gulshan</span><br/>
              <span className="team-member-role">IT Manager</span>
            </div>
          </div>
        </div>
      </div>

      <div id="about-footer">
        <span id="footer-text">&copy; 2024 Gadi Chahiye. All Rights Reserved.</span>
      </div>
    </div>
  );
}

export default AboutUs;

