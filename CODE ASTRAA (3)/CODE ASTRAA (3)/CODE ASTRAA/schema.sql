create database ai_doctor;
use ai_doctor;

CREATE TABLE user_login (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Renamed from password_hash

    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into user_login ( full_name , email , password , phone )
values 
 ( "Akshat Raj" , "ak@ak" , "123" , "234");

select * from user_login ;
SELECT email, password FROM user_login WHERE email = 'akshatraj873@gmail.com';



SELECT email , password FROM user_login WHERE email LIKE '%akshatraj873%';

ALTER TABLE user_login
CHANGE COLUMN password_hash password VARCHAR(255) NOT NULL;


