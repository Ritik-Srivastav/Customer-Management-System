A Customer Management System (CMS) helps businesses keep track of their customers' information and interactions to provide better service and boost sales. It streamlines managing customer data and relationships.

Steps to run project

**1)Run below command to clone the project in your system**

   git clone https://github.com/Ritik-Srivastav/Customer-Management-System.git

**2)Steps to start Backend**

a)Move to backend folder and run command npm install
  
     cd backend
     
     npm install


b)Create a .env file in backend folder with below variables and add your credentials.

    PORT=5000
    
    MONGO_URI="Your url"
    
    EMAIL_USER="Your email"
    
    EMAIL_PASS="Email app password"
    
    TWILIO_ACCOUNT_SID="Add SID"
    
    TWILIO_AUTH_TOKEN="ADD Token"
    
    TWILIO_PHONE_NUMBER= "Add phonenumber"
  
    JWT_SECRET="ADD JWTSecret"

c)To run backend server run command

    node server.js

**3)Steps to start frontend**

  a)Move to the frontend folder , install dependency using npm install and run frontend server using npm run dev.**
  
     cd frontend
     
     npm install
     
     npm run dev
  
