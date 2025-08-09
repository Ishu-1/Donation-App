# Donor Portal – Overview

The **Donor Portal** is the interface for individuals who wish to contribute usable items (clothes, shoes, electronics, etc.) to NGOs and recipients.  
It allows donors to **list items for donation**, manage their active and past donations, and respond to specific donation requests from NGOs or recipients.  

The donor experience is designed to be **clean, responsive, and intuitive**, making it easy to browse, list, and track donations.

---

## Key Features

### 1. Authentication & Onboarding
![Login Sign up page](images/Donor/Sign_up%20Login.jpeg)  
- Secure sign-up and login for donors using **JWT authentication**.  
- Responsive form design for desktop and mobile.

---

### 2. Home Dashboard
![Home Page](images/Donor/Home.jpeg)  
- Welcoming home page highlighting available donation categories.  
- Quick navigation to donation management, unlisted requests, and product listing.

---

### 3. Product Listing & Management
![Products Page](images/Donor/Products.jpeg)  
- **Products Page:** View all listed donation items.

![Add Product Popup](images/Donor/Products%20-%20Add%20Product%20popup.jpeg)  
- **Add Product Popup:** A form to create a new donation listing, including category, description, and item images.
- Uses **REST API** to send product data to the backend for storage.

---

### 4. Donation Request Handling
![Unlisted Requests](images/Donor/Unlisted%20Requests%20made.jpeg) 
- Track custom/unlisted donation requests made by NGOs or recipients.

![Request Accepted Notification](images/Donor/DonorRequestAccepted%20Notification.jpeg)
- Get notified when an NGO accepts your donation request.

![Donation Accepted Email](images/Donor/Donation%20Accepted%20Email%20message.jpeg)
- Email notification confirming request acceptance.<br><br>
- Manage both **listed donation offers** and **unlisted custom requests** in one place.  
- Real-time updates fetched via API calls.  
- Email notification and in-app alerts when an NGO accepts a donation.

---

### 5. Impact Tracking
![Dashboard Page](images/Donor/Dashboard.jpeg)  
- Donor dashboard displaying:  
  - Total donations made.
  - NGO collaborations.
  - Recent activity log.

---

## Tech Stack (Donor Side)
- **Frontend:** React (JSX), Tailwind CSS (for responsive layouts)  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **API Communication:** REST API  
- **Authentication:** JWT  
- **Notifications:** Email alerts and in-app notifications for donation status updates

---

## Responsive Design
All pages and components adapt to mobile, tablet, and desktop using **Tailwind’s responsive classes**, ensuring accessibility for all donors.
