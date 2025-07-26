from flask import Flask, render_template, request, session, jsonify, redirect, url_for, make_response , flash
import mysql.connector
import openai

import pandas as pd
app = Flask(__name__)
df = pd.read_csv("symptoms_dataset.csv")
app.secret_key = "your_secret_key"

openai.api_key = "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" 





# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="akshat@123",
        database="ai_doctor"
    )







# Fetch and Print All Users at Startup
def fetch_all_users():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT email, password FROM user_login")  # Fetch email and password
    users = cursor.fetchall()

    print("\n--- All Users in Database ---")
    for user in users:
        print(f"Email: {user['email']}\nPassword: {user['password']}")
    print("-----------------------------\n")

    cursor.close()
    db.close()

# Call function at startup
fetch_all_users()








@app.route('/signup', methods=['GET', 'POST'])
def signup():
    db = get_db_connection()
    cursor = db.cursor()
    if request.method == 'POST':
        full_name = request.form['fullName']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirmPassword']
        terms = request.form.get('terms')

        # Backend validations
        if password != confirm_password:
            flash('Passwords do not match.')
            return redirect(url_for('signup'))

        if not terms:
            flash('You must accept the Terms and Privacy Policy.')
            return redirect(url_for('signup'))

        # Save to DB
        try:
            cursor.execute(
                "INSERT INTO user_login (full_name, email, password) VALUES (%s, %s, %s)",
                (full_name, email, password)
            )
            db.commit()
            flash('Account created successfully! Please log in.')
            return redirect(url_for('index'))  # or your dashboard route
        except mysql.connector.Error as err:
            db.rollback()
            flash(f"Error: {err}")
            return redirect(url_for('signup'))
    cursor.close()
    db.close()

    return render_template('signup.html')







# Login Page (GET and POST)
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])  # Add this route for /login
def login():
    if request.method == 'GET':
        return render_template('login.html')

    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '').strip()

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required!"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT email, password FROM user_login WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user and password == user['password']:  
        session['email'] = user['email']
        return jsonify({"success": True, "redirect": url_for("index")})

    return jsonify({"success": False, "message": "Invalid email or password."}), 401










@app.route('/analyze', methods=['POST'])
def analyze_symptoms():
    data = request.get_json()
    input_symptoms = [sym.strip().lower() for sym in data['symptoms'].split(',') if sym.strip()]
    
    # Match rows where all 4 symptoms are present
    matched_diseases = []

    for index, row in df.iterrows():
        row_symptoms = [str(row['symptoms1']).lower(), str(row['symptoms2']).lower(), 
                        str(row['symptoms3']).lower(), str(row['symptoms4']).lower()]
        if all(sym in row_symptoms for sym in input_symptoms):
            matched_diseases.append(row['disease'])

    if matched_diseases:
        return jsonify({'status': 'success', 'diseases': list(set(matched_diseases))})
    else:
        return jsonify({'status': 'not_found', 'message': 'No matching disease found.'})









@app.route('/medication-guide.html')
def medication_guide():
    return render_template('medication-guide.html')






@app.route('/doctor-app')
def doctor_app():
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']

    # Connect to DB
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch doctors from DB
    cursor.execute("SELECT * FROM doctor")
    doctors = cursor.fetchall()

    cursor.close()
    conn.close()

    # Pass doctors list to template
    return render_template('doctor-app.html', email=email, doctors=doctors)







@app.route('/symptom-checker')
def symptom_checker():
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    return render_template('symptom-checker.html', email=email)
  # or dashboard.html    







# Home/Dashboard
#@app.route('/index')
#def index():
#    if 'email' not in session:
#        return redirect(url_for('login'))
#    return render_template('index.html')


@app.route('/index')
def index():
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    return render_template('index.html', email=email)  # or dashboard.html


    

# AI Chat Page
@app.route('/aichatdoctor')
def ai_chat_doctor():
    return render_template('aichatdoctor.html')

   



@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    if 'email' not in session:
        return jsonify({"success": False, "message": "User not logged in"}), 401

    email = session['email']
    doctor_id = request.form.get('doctor_id')
    appointment_date = request.form.get('date')

    if not doctor_id or not appointment_date:
        return jsonify({"success": False, "message": "Doctor ID and Date are required"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch user_id and username using email
    cursor.execute("SELECT id, username FROM user_login WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        db.close()
        return jsonify({"success": False, "message": "User not found"}), 404

    user_id = user['id']
    username = user['username']

    # Insert appointment
    cursor.execute("""
        INSERT INTO appointments (user_id, username, doctor_id, date)
        VALUES (%s, %s, %s, %s)
    """, (user_id, username, doctor_id, appointment_date))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"success": True, "message": "Appointment booked successfully"})






# OpenAI Chat Route
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"success": False, "message": "Message cannot be empty"}), 400
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": user_input}
            ]
        )
        ai_response = response['choices'][0]['message']['content'].strip()
        return jsonify({"success": True, "response": ai_response})
    except Exception as e:
        return jsonify({"success": False, "message": "Error in AI response."}), 500

if __name__ == '__main__':
    print("Starting Flask Server...")
    app.run(debug=True)
