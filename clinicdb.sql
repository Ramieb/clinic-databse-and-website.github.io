-- Create Database
CREATE DATABASE IF NOT EXISTS clinicdb;
USE clinicdb;

-- Table Creation
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('patient', 'doctor', 'nurse', 'receptionist', 'admin') NOT NULL
);

CREATE TABLE Office (
    office_id INT PRIMARY KEY NOT NULL,
    location VARCHAR(128) NOT NULL,
    admin_id VARCHAR(9),
    admin_start_date DATE
);

CREATE TABLE Admin (
    employee_ssn VARCHAR(9) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hire_date DATE,
    salary INT,
    office_id INT,
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (office_id) REFERENCES Office(office_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- Resolve Circular Reference by Altering Office Table
ALTER TABLE Office
ADD FOREIGN KEY (admin_id) REFERENCES Admin(employee_ssn)
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE Doctor (
    employee_ssn VARCHAR(9) PRIMARY KEY NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    admin_ssn VARCHAR(9),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hire_date DATE,
    salary INT,
    office_id INT,
    specialty VARCHAR(25),
    specialist BOOL,
    cost INT,
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (office_id) REFERENCES Office(office_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (admin_ssn) REFERENCES Admin(employee_ssn)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Nurse (
    employee_ssn VARCHAR(9) PRIMARY KEY NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    admin_ssn VARCHAR(9),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hire_date DATE,
    salary INT,
    office_id INT,
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (office_id) REFERENCES Office(office_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (admin_ssn) REFERENCES Admin(employee_ssn)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Receptionist (
    employee_ssn VARCHAR(9) PRIMARY KEY NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    admin_ssn VARCHAR(9),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hire_date DATE,
    salary INT,
    office_id INT,
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (office_id) REFERENCES Office(office_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (admin_ssn) REFERENCES Admin(employee_ssn)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Patient (
    patient_id INT PRIMARY KEY NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    address VARCHAR(128),
    phone_number VARCHAR(10),
    primary_id VARCHAR(9),
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (primary_id) REFERENCES Doctor(employee_ssn)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Appointment (
    app_date DATE NOT NULL,
    P_ID INT NOT NULL,
    app_start_time TIME NOT NULL,
    app_end_time TIME NOT NULL,
    D_ID VARCHAR(9) NOT NULL,
    reason_for_visit VARCHAR(50),
    referral VARCHAR(9),
    need_referral BOOL,
    deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (P_ID, app_date, app_start_time),
    FOREIGN KEY (D_ID) REFERENCES Doctor(employee_ssn)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (referral) REFERENCES Doctor(employee_ssn)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE Appointment
ADD COLUMN deleted BOOLEAN DEFAULT FALSE;

CREATE TABLE Billing (
    P_ID INT NOT NULL,
    D_ID VARCHAR(9),
    charge_for VARCHAR(50),
    total_charge INT,
    charge_date DATETIME NOT NULL,
    paid_off BOOL,
    paid_total INT,
    PRIMARY KEY (P_ID, charge_date),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (D_ID) REFERENCES Doctor(employee_ssn)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Payment (
    P_ID INT NOT NULL,
    total_paid INT,
    pay_date DATETIME NOT NULL,
    pay_towards DATETIME,
    PRIMARY KEY (P_ID, pay_date),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (P_ID, pay_towards) REFERENCES Billing(P_ID, charge_date)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Referral (
    primary_doc VARCHAR(9) NOT NULL,
    P_ID INT NOT NULL,
    ref_date DATETIME NOT NULL,
    experiation DATE NOT NULL,
    specialist VARCHAR(9) NOT NULL,
    doc_appr BOOL,
    used BOOL,
    PRIMARY KEY (P_ID, ref_date),
    FOREIGN KEY (primary_doc) REFERENCES Doctor(employee_ssn)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (specialist) REFERENCES Doctor(employee_ssn)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Medication (
    medicine VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    dosage VARCHAR(25),
    time_of_day VARCHAR(20),
    D_ID VARCHAR(9),
    P_ID INT NOT NULL,
    cost INT,
    PRIMARY KEY (P_ID, medicine),
    FOREIGN KEY (D_ID) REFERENCES Doctor(employee_ssn)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Allergies (
    allergy VARCHAR(20) NOT NULL,
    P_ID INT NOT NULL,
    start_date DATE,
    end_date DATE,
    seasonal BOOL,
    PRIMARY KEY (P_ID, allergy),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Illness (
    ailment VARCHAR(50) NOT NULL,
    P_ID INT NOT NULL,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (P_ID, ailment),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Surgery (
    procedure_done VARCHAR(50) NOT NULL,
    P_ID INT NOT NULL,
    body_part VARCHAR(25),
    surgery_date DATE,
    cost INT,
    PRIMARY KEY (P_ID, procedure_done),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Immunization (
    vaccine VARCHAR(50) NOT NULL,
    P_ID INT NOT NULL,
    vax_date DATE,
    cost INT,
    PRIMARY KEY (P_ID, vaccine),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Med_History (
    P_ID INT NOT NULL,
    last_visit DATETIME NOT NULL,
    height SMALLINT,
    weight SMALLINT,
    blood_pressure VARCHAR(10),
    PRIMARY KEY (P_ID, last_visit),
    FOREIGN KEY (P_ID) REFERENCES Patient(patient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW Doctor_Patient_History_View
AS SELECT	P.patient_id, P.first_name, P.last_name,
			H.height, HIST.weight, H.blood_pressure,
            MED.medicine, MED.start_date, MED.end_date, MED.dosage,
            A.allergy, A.start_date, A.end_date, A.seasonal,
            S.procedure_done, S.body_part, S.surgery_date,
            IMM.vaccine, IMM.vax_date,
            ILL.ailment, ILL.start_date, ILL.end_date
FROM Patient AS P
LEFT OUTER JOIN Med_history AS H ON P.patient_id = H.P_ID
LEFT OUTER JOIN Medication AS MED ON P.patient_id = MED.P_ID
LEFT OUTER JOIN Allergies AS A ON P.patient_id = A.P_ID
LEFT OUTER JOIN Surgery AS S ON P.patient_id = S.P_ID
LEFT OUTER JOIN Immunization AS IMM ON P.patient_id = IMM.P_ID
LEFT OUTER JOIN Illness AS ILL ON P.patient_id = ILL.P_ID;

CREATE VIEW Outstanding_Bills
AS SELECT	P.patient_id, P.first_name, P.last_name,
			B.charge_for, B.total_charged, B.charge_date, B.paid_off
FROM Patient AS P
LEFT OUTER JOIN Billing AS B ON P.patient_id = B.P_ID
WHERE B.paid_off = FALSE;

CREATE VIEW Paid_Bills
AS SELECT	P.patient_id, P.first_name, P.last_name,
			B.charge_for, B.total_charged, B.charge_date, B.paid_off,
            PAY.total_paid, PAY.pay_date
FROM Patient AS P
LEFT OUTER JOIN Payment AS PAY ON P.patient_id = PAY.P_ID
LEFT OUTER JOIN Billing AS B ON P.patient_id = B.P_ID
WHERE B.paid_off = TRUE;

-- Find the login info in users table, then if found use the username to query the specific role to find the correct user
DELIMITER //
CREATE PROCEDURE Login ( IN account_username VARCHAR(50), IN account_password VARCHAR(50), OUT login_status BOOL, OUT account_role VARCHAR(50))
BEGIN
    DECLARE account_exists INT;
    DECLARE found_role VARCHAR(50);
    
    SELECT COUNT(*), U.role
    INTO account_exists, found_role
	FROM Users AS U
    WHERE U.username = account_username AND U.password = account_password;
    
    IF account_exists > 0 THEN
		SET login_status = TRUE;
        SET account_role = found_role;
    ELSE
		SET login_status = FALSE;
        SET account_role = found_role;
    END IF;
END //
DELIMITER ;

/* DELIMITER //
CREATE TRIGGER No_Referral
BEFORE INSERT ON Appointment
FOR EACH ROW
BEGIN
	DECLARE referral_exists INT;
    
    SELECT COUNT(*)
    INTO referral_exists
	FROM Referral AS R
    WHERE R.P_ID = NEW.P_ID AND R.specialist = NEW.D_ID AND R.doc_appr = TRUE; -- new refers to the new row trying to be inserted and specialist is the doctor id of the specialist that is being referred to
    
    IF referral_exists = 0 THEN
        IF EXISTS (
            SELECT 1 
            FROM Doctor 
            WHERE employee_ssn = NEW.D_ID 
              AND specialist = TRUE
        ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create appointment: No approved referral to specialist.';
        END IF;
    END IF;
END; //

-- THIS MIGHT NOT WORK SAYS ERRORS ON MY WORKBENCH
DELIMITER //
CREATE TRIGGER Appointment_Reminders
-- The trigger will begin when an appointment is added
AFTER INSERT ON Appointment
FOR EACH ROW
BEGIN
    -- Calculate the 1-day and 2-hour reminder times
    DECLARE reminder_date_1day DATETIME;
    DECLARE reminder_date_2hour DATETIME;

    SET reminder_date_1day = DATE_SUB(NEW.app_date, INTERVAL 1 DAY);
    SET reminder_date_2hour = TIMESTAMPADD(HOUR, -2, CONCAT(NEW.app_date, ' ', NEW.app_start_time));

    -- Insert logic to notify the patient (or log the reminders if needed)
    INSERT INTO Logs (log_message, log_time)  -- Example log for debugging
    VALUES (CONCAT('Reminder set for 1 day before appointment on ', reminder_date_1day), NOW());

    INSERT INTO Logs (log_message, log_time)  -- Log for 2-hour reminder
    VALUES (CONCAT('Reminder set for 2 hours before appointment on ', reminder_date_2hour), NOW());
END; //
DELIMITER ; */

DELIMITER //
CREATE EVENT Send_Reminders
ON SCHEDULE EVERY 1 HOUR  -- Adjust based on your needs
DO
BEGIN
    -- Send the 1-day reminders
    SELECT 
        P.phone_number, 
        CONCAT('Reminder: Your appointment is tomorrow at ', A.app_start_time) AS message
    FROM Appointment A
    JOIN Patient P ON A.P_ID = P.patient_id
    WHERE A.app_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      AND CURTIME() BETWEEN '00:00:00' AND '01:00:00'; -- Run within the first hour

    -- Send the 2-hour reminders
    SELECT 
        P.phone_number, 
        CONCAT('Reminder: Your appointment is in 2 hours at ', A.app_start_time) AS message
    FROM Appointment A
    JOIN Patient P ON A.P_ID = P.patient_id
    WHERE CONCAT(A.app_date, ' ', A.app_start_time) = TIMESTAMPADD(HOUR, 2, NOW());

    -- Optional: Add logic to interface with external services like Twilio for SMS
END; //
DELIMITER ;

;

-- Testing the appointment_Reminder by storing the reminders in a log table. This table is not required, only using for debugging.
CREATE TABLE Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_message VARCHAR(255),
    log_time DATETIME
);
-- THIS SECTION MIGHT NOT WORK, DELETE/COMMENT OUT IF NECESSARY

-- 2 triggers will be the appointment reminder & referral trigger
-- create view for the receptionist to see all of patients bills and payments, create view for doctor to see all patients med history combined.
-- create view where receptionist can see current appts for specific doctor
-- need to add login info (username, password, security lvl/role)

-- TRIGGERS
DELIMITER //
CREATE TRIGGER Calculate_End_Time
BEFORE INSERT ON Appointment
FOR EACH ROW
BEGIN
    -- Add 1 hour to the start time for the default appointment duration
    SET NEW.app_end_time = ADDTIME(NEW.app_start_time, '01:00:00');
END; //
DELIMITER ;

-- Ensure that no two appointments overlap for the same doctor
DELIMITER //
CREATE TRIGGER Prevent_Double_Booking
BEFORE INSERT ON Appointment
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT;

    SELECT COUNT(*)
    INTO overlap_count
    FROM Appointment
    WHERE D_ID = NEW.D_ID
      AND app_date = NEW.app_date
      AND (
        (NEW.app_start_time BETWEEN app_start_time AND app_end_time)
        OR (NEW.app_end_time BETWEEN app_start_time AND app_end_time)
        OR (app_start_time BETWEEN NEW.app_start_time AND NEW.app_end_time)
      );

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Double-booking is not allowed for this doctor.';
    END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER Populate_Default_Data
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    -- Insert default data for the new user in related tables
    INSERT INTO Prescriptions (username, prescription_data) VALUES (NEW.username, 'default prescription');
    INSERT INTO Billing (username, billing_data) VALUES (NEW.username, 'default billing');
    INSERT INTO Medical_History (username, history_data) VALUES (NEW.username, 'default history');
    -- Repeat for other tables if needed (e.g., Payment, Referrals)
END; //
DELIMITER ;

-- LOGIN DUMMY INFO
INSERT INTO Users(username, password, role) 
VALUES ('temp_username', 'temp_pass', 'doctor'),
('asmith', 'doctor2', 'doctor'),
('bjohnson', 'doctor3', 'doctor'),
('cwhite', 'doctor4', 'doctor'),
('dlee', 'doctor5', 'doctor'),
('mgarcia_nurse', 'nurse1', 'nurse'),
('kchan_nurse', 'nurse2', 'nurse'),
('ljohnson_nurse', 'nurse3', 'nurse'),
('jwilson_rec', 'receptionist1', 'receptionist'),
('mrodriguez_rec', 'receptionist2', 'receptionist'),
('tlee_rec', 'receptionist3', 'receptionist'),
('big_boss', 'admin1', 'admin'),
('kthompson_patient', 'patient1', 'patient'),
('nlee_patient', 'patient2', 'patient'),
('rmartinez_patient', 'patient3', 'patient');

-- OFFICE DUMMY INFO
INSERT INTO Office (office_id, location, admin_id, admin_start_date) 
VALUES (1, '1010 Main St, Houston, TX', '111111111', '2023-01-15'),
(2, '2020 West Loop N, Houston, TX', '111111111', '2022-05-22'),
(3, '3030 Fannin St, Houston, TX', '111111111', '2023-03-10');

-- ADMIN DUMMY INFO 
INSERT INTO Admin (employee_ssn, username, first_name, last_name, hire_date, salary, office_id) 
VALUES ('111111111', 'big_boss', 'Mr.', 'Boss', '2021-08-15', 175000, 1);

-- DOCTOR DUMMY INFO
INSERT INTO Doctor (employee_ssn, username, Admin_ssn, first_name, last_name, hire_date, salary, office_id, specialty, specialist, cost) 
VALUES ('123456789','temp_username', '111111111', 'John', 'Doe', '2024-01-15', 150000, 1, 'Cardiology', TRUE, 200),
('234567890', 'asmith', '111111111', 'Alice', 'Smith', '2023-05-22', 120000, 2, 'Pediatrics', FALSE, 150),
('345678901', 'bjohnson', '111111111', 'Bob', 'Johnson', '2022-03-15', 145000, 1, 'Family Medicine', FALSE, 150),
('456789012', 'cwhite', '111111111', 'Charlie', 'White', '2023-08-10', 130000, 3, 'Internal Medicine', FALSE, 200),
('567890123', 'dlee', '111111111', 'Diana', 'Lee', '2024-02-01', 155000, 2, 'Neurology', TRUE, 300);

-- NURSE DUMMY INFO
INSERT INTO Nurse (employee_ssn, username, Admin_ssn, first_name, last_name, hire_date, salary, office_id) 
VALUES ('678901234', 'mgarcia_nurse', '111111111', 'Maria', 'Garcia', '2023-04-10', 75000, 1),
('789012345', 'kchan_nurse', '111111111', 'Kevin', 'Chan', '2022-11-05', 78000, 2),
('890123456', 'ljohnson_nurse', '111111111', 'Laura', 'Johnson', '2024-01-25', 70000, 3);

-- RECEPTIONIST DUMMY INFO 
INSERT INTO Receptionist (employee_ssn, username, Admin_ssn, first_name, last_name, hire_date, salary, office_id) 
VALUES ('901234567', 'jwilson_rec', '111111111', 'John', 'Wilson', '2023-05-10', 50000, 1),
('012345678', 'mrodriguez_rec', '111111111', 'Maria', 'Rodriguez', '2022-12-01', 52000, 2),
('123456780', 'tlee_rec', '111111111', 'Tina', 'Lee', '2024-03-15', 48000, 3);

-- PATIENT DUMMY INFO
INSERT INTO Patient (patient_id, username, first_name, last_name, date_of_birth, address, phone_number, primary_id) 
VALUES (1, 'kthompson_patient', 'Kyle', 'Thompson', '1995-04-12', '321 Maple St, Houston, TX', '2817894567', '234567890'),
(2, 'nlee_patient', 'Nancy', 'Lee', '1988-07-22', '654 Cedar St, Houston, TX', '8321114321', '345678901'),
(3, 'rmartinez_patient', 'Ricardo', 'Martinez', '1993-09-30', '987 Birch St, Houston, TX', '7134551234', '567890123');

-- APPOINTMENTS DUMMY INFO
INSERT INTO Appointment (app_date, P_ID, app_start_time, app_end_time, D_ID, reason_for_visit, referral, need_referral)
VALUES 
    ('2023-05-15', 1, '10:00:00', '10:30:00', '123456789', 'Follow-up', NULL, FALSE),
    ('2023-06-10', 2, '14:00:00', '14:30:00', '234567890', 'Check-up', NULL, TRUE),
    ('2023-07-20', 3, '09:00:00', '09:45:00', '345678901', 'Routine Consultation', NULL, FALSE);

-- BILLING DUMMY INFO
INSERT INTO Billing (P_ID, D_ID, charge_for, total_charge, charge_date, paid_off, paid_total)
VALUES 
    (1, '123456789', 'Consultation', 150, '2023-04-10', FALSE, 0),
    (2, '234567890', 'Lab Test', 200, '2023-05-15', TRUE, 200),
    (3, '345678901', 'Follow-up', 100, '2023-06-20', FALSE, 50);

-- PAYMENT DUMMY INFO
INSERT INTO Payment (P_ID, total_paid, pay_date, pay_towards)
VALUES 
    (1, 75, '2023-04-15', '2023-04-10'),
    (2, 200, '2023-05-18', '2023-05-15'),
    (3, 50, '2023-06-25', '2023-06-20');

-- REFERRALS DUMMY INFO
INSERT INTO Referral (primary_doc, P_ID, ref_date, experiation, specialist, doc_appr, used)
VALUES 
    ('123456789', 1, '2023-04-01', '2023-06-01', '345678901', TRUE, FALSE),
    ('234567890', 2, '2023-05-01', '2023-07-01', '456789012', FALSE, TRUE),
    ('345678901', 3, '2023-06-01', '2023-08-01', '567890123', TRUE, TRUE);

-- MEDICATIONS DUMMY INFO
INSERT INTO Medication (medicine, start_date, end_date, dosage, time_of_day, D_ID, P_ID, cost)
VALUES 
    ('Amoxicillin', '2023-01-10', '2023-01-20', '500mg', 'Morning', '123456789', 1, 30),
    ('Lisinopril', '2023-02-15', NULL, '10mg', 'Evening', '234567890', 2, 25),
    ('Metformin', '2023-03-01', NULL, '500mg', 'Morning', '345678901', 3, 20);


-- ALLERGIES DUMMY INFO
INSERT INTO Allergies (allergy, P_ID, start_date, end_date, seasonal)
VALUES 
    ('Peanuts', 1, '2022-03-01', NULL, FALSE),
    ('Pollen', 2, '2022-04-01', '2023-04-01', TRUE),
    ('Dust', 3, '2021-05-10', NULL, FALSE);

-- ILLNESSES DUMMY INFO
INSERT INTO Illness (ailment, P_ID, start_date, end_date)
VALUES 
    ('Hypertension', 1, '2021-01-01', NULL),
    ('Diabetes', 2, '2020-05-01', '2023-02-01'),
    ('Asthma', 3, '2019-10-15', NULL);

-- SURGERIES DUMMY INFO
INSERT INTO Surgery (procedure_done, P_ID, body_part, surgery_date, cost)
VALUES 
    ('Appendectomy', 1, 'Abdomen', '2022-10-15', 5000),
    ('Knee Replacement', 2, 'Knee', '2023-03-20', 12000),
    ('Cataract Surgery', 3, 'Eye', '2023-05-15', 7000);

-- IMMUNIZATIONS DUMMY INFO
INSERT INTO Immunization (vaccine, P_ID, vax_date, cost)
VALUES 
    ('Flu Shot', 1, '2023-09-15', 30),
    ('Covid-19', 2, '2023-01-10', 50),
    ('Hepatitis B', 3, '2023-04-22', 45);

-- MEDICAL HISTORY DUMMY INFO
INSERT INTO Med_History (P_ID, last_visit, height, weight, blood_pressure)
VALUES 
    (1, '2023-05-01', 170, 70, '120/80'),
    (2, '2023-05-10', 165, 75, '130/85'),
    (3, '2023-04-20', 160, 68, '125/82');

COMMIT;