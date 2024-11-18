ReadMe File for Clinic Database and Website
Project Overview
The Clinic Database and Website is a web application designed to manage patient and staff data efficiently. It supports various features, including appointment scheduling, referral management, and secure user authentication. The project uses MySQL for database management and a combination of HTML, CSS, JavaScript, and Node.js for the web application.
File Structure
Root Directory
●	server.js: Entry point for the backend server.
●	styles.css: Global stylesheet for the frontend.
●	index.html: The main landing page of the application.
________________________________________
Backend Directory (backend)
Contains the backend code, including routes and database configuration.
Subdirectories
●	routerFiles:
○	adminRoute.js: Routes for admin-related operations.
○	appointmentRoute.js: Routes for appointment handling.
○	doctorRoute.js: Routes for doctor-specific operations.
○	loginRoute.js: Handles user login.
○	nurseRoute.js: Routes for nurse-specific operations.
○	patientRoute.js: Routes for patient-specific operations.
○	receptionistRoute.js: Routes for receptionist-specific operations.
○	registerRoute.js: Handles user registration.
○	reportRoute.js: Routes for generating reports.
●	db.js: Database connection configuration.
________________________________________
Frontend Directory (frontend)
Contains the JavaScript files for client-side functionality.
●	addAppointment.js: Handles adding new appointments.
●	addDoctor.js: Handles adding new doctors.
●	addEmployee.js: Manages adding employees.
●	addPatient.js: Handles adding new patients.
●	appointmentData.js: Manages appointment-related data.
●	doctor.js: Handles doctor-specific frontend logic.
●	employees.js: Manages employee-related data.
●	login.js: Handles user login frontend logic.
●	medical_history.js: Manages patient medical history.
●	nurse.js: Handles nurse-specific frontend logic.
●	patient.js: Manages patient-specific frontend interactions.
●	patientData.js: Handles patient data.
●	recept_appt.js: Manages receptionist appointment interactions.
●	recept_billing.js: Manages receptionist billing interactions.
●	recept_register.js: Handles receptionist registration processes.
●	referrals.js: Manages referral logic.
●	schedule.js: Handles schedule-related functionalities.
________________________________________
HTML Directory (html)
Contains all the HTML files for the different user interfaces.
●	admin.html: Admin dashboard.
●	admin_patients.html: Admin view for managing patients.
●	billing.html: Billing management.
●	billing_receipt.html: Displays billing receipts.
●	doctor.html: Doctor dashboard.
●	doctorSchedule.html: Doctor scheduling interface.
●	employees.html: Employees management page.
●	medical_history.html: Displays patient medical history.
●	nurse.html: Nurse dashboard.
●	patient.html: Patient dashboard.
●	payment.html: Handles patient payments.
●	prescriptions.html: Displays prescriptions for patients.
●	rec_appt.html: Receptionist appointment management.
●	recept_register.html: Receptionist registration page.
●	receptionist.html: Receptionist dashboard.
●	referrals.html: Manages referrals for patients and doctors.
●	register.html: User registration page.
________________________________________
Database File
●	clinicdb.sql: SQL dump for the database, including table definitions and initial data.
________________________________________
Images
Contains images used in the project:
●	guy1.png
●	receptionist1.png
●	receptionist2_clear.png
●	reload_pic.png
________________________________________
Project Details
1. Types of Data
●	Patients: Personal information, appointments, referrals.
●	Doctors: Personal details, schedules, patient interactions.
●	Appointments: Time, date, reason, and involved parties.
●	Referrals: Request status (Pending, Approved, Denied).
●	Employees: Admin, receptionists, nurses.
2. User Roles
●	Admin: Full control over the system.
●	Doctor: View and manage patients, approve/deny referrals.
●	Receptionist: Manage appointments, register patients.
●	Nurse: View medical history and assist in patient care.
●	Patient: Book appointments, view referrals and prescriptions.
3. Semantic Constraints
●	Triggers: Validate data during insert/update operations.
●	Constraints: Foreign key relationships, unique constraints on usernames.
4. Reports and Queries
●	Reports: Medical history, referrals, appointments.
●	Queries: Upcoming appointments, pending referrals, patient data.

Instructions for Setup
1.	
Clone Repository:
bash
git clone https://github.com/Ramieb/clinic-databse-and-website.github.io.git
2.	
Install Dependencies:
bash
cd backend
npm install
3.	
Set Environment Variables: Update .env with the following:
makefile
DB_HOST=Clinic-db.mysql.database.azure.com
DB_USER=clinicdb
DB_PASSWORD=team9db!
DB_NAME=clinicdb
DB_PORT=3306





4.	
Import Database: Use the provided clinicdb.sql file to set up the database.
bash
mysql -u username -p clinicdb < clinicdb.sql

5.
Start the Server:
bash
node server.js
Access the Application: Open http://localhost:3000 in your browser.
OR

Use Azure URL: http://clinic-website.azurewebsites.net


Usernames and passwords:
Username: temp_username | Password: temp_pass | Role: doctor
Username: asmith | Password: doctor2 | Role: doctor
Username: bjohnson | Password: doctor3 | Role: doctor
Username: cwhite | Password: doctor4 | Role: doctor
Username: dlee | Password: doctor5 | Role: doctor
Username: mgarcia_nurse | Password: nurse1 | Role: nurse
Username: kchan_nurse | Password: nurse2 | Role: nurse
Username: ljohnson_nurse | Password: nurse3 | Role: nurse
Username: jwilson_rec | Password: receptionist1 | Role: receptionist
Username: mrodriguez_rec | Password: receptionist2 | Role: receptionist
Username: tlee_rec | Password: receptionist3 | Role: receptionist
Username: big_boss | Password: admin1 | Role: admin
Username: kthompson_patient | Password: patient1 | Role: patient
Username: nlee_patient | Password: patient2 | Role: patient
Username: rmartinez_patient | Password: patient3 | Role: patient


