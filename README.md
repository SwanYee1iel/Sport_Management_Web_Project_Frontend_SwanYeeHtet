1. Project Title 

Sport Connect: A Web-Based Sport Facility Management and Buddy Discovery Platform 

Project Type: Web Application POC for Senior Project: Yes  

2. Team Members  

Member 1: [Saw Min Thant - 671501]  

Member 2: [Swan Yee Htet - 6715082]  

3. Problem Statement & Motivation  

What problem does this system solve?: Managing sports facility bookings and finding partners often involves fragmented manual processes. This system centralizes reservations, provides staff with quick 1-minute payment verification tools, and enables a "Sport Buddy" feature to help users find partners without complex chat systems.  

Who is the target user?: Sports enthusiasts looking for facilities/partners, facility staff responsible for daily operations, and administrators managing the business.  

Why does this problem matter?: Inefficient booking leads to empty courts, while the lack of a partner-finding tool reduces community engagement in physical activities.  

4. Project Scope & Features  

User Authentication & Social Profiles: Secure login for Users, Staff, and Admins. Users manage profiles with gender, profile pictures, and multi-sport interests.  

Court Reservation System: Real-time booking with automated price calculation based on duration and sport type.  

Sport Buddy Discovery: A searchable directory where users find partners based on shared interests and contact them via email.  

Staff Operations Dashboard: Tools for verifying payment screenshots, reporting maintenance issues, and toggling court availability.  

Admin Analytics & Auditing: Dashboards to monitor revenue, track "most booked sports," and audit staff performance (who confirmed which booking/issue).  

5. Data Models (Supporting full CRUD: Create, Read, Update, Delete for all entities) 

Entity 1: User 

Fields: User_ID, User_Name, password, User_Email, Gender, Phone_Number, Profile_Picture, Interests.  

Operations: Create (Sign-up), Read (Profile), Update (Edit), Delete (Account deletion).  

Entity 2: Staff 

Fields: Staff_ID, Staff_Name, Staff_Email, Staff_Password.  

Operations: Create (Admin add), Read (List), Update (Status), Delete (Admin remove).  

Entity 3: Admin 

Fields: Admin_ID, Admin_Name, Hourly_Rate (Configuration), Total_Price (Report).  

Operations: Create, Read, Update (Change rates), Delete.  

Entity 4: Booking 

Fields: Booking_ID, Date, Start_Time, Duration, Booking_Status, Payment_Method, Created_At.  

Operations: Create (New), Read (History), Update (Status), Delete (Cancel).  

Entity 5: Courts 

Fields: Court_ID, Court_Number, Status (Available/Maintenance).  

Operations: Create, Read, Update (Maintenance toggle), Delete.  

Entity 6: Sports 

Fields: Sports_ID, Sports_Name.  

Operations: Create, Read, Update, Delete.  

Entity 7: Sports_type 

Fields: Sports_type_ID, Sports_type_name.  

Operations: Create, Read, Update, Delete.  

Entity 8: Payment 

Fields: Payment_ID, Payment_Proof, Bank_Details, Payment_Status.  

Operations: Create (Upload), Read, Update (Verify), Delete.  

Entity 9: Issues 

Fields: Issue_ID, Description, Date_Reported, Issue_Status.  

Operations: Create (Staff report), Read (Admin view), Update (Resolution), Delete.  

6. Technology Stack  

Frontend: React.js / Next.js 

Backend: Node.js with Next.js API Routes 

Database: MongoDB 

Deployment: MongoDB Atlas 


Credentials
- **Admin_email** : admin@sportconnect.com
- **Admin_password** : adminpassword123
- **Staff_email** : Staff@gmail.com
- **Staff_password** : 12345678

 
