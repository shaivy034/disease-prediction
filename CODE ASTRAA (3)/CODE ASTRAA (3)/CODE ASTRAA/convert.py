import pandas as pd

# Step 1: Load your original CSV
df = pd.read_csv("symptoms_dataset.csv")

# Step 2: Convert all columns and values to lowercase
df.columns = [col.lower() for col in df.columns]
df = df.applymap(lambda x: x.lower() if isinstance(x, str) else x)

# Step 3: Save to Excel file
df.to_excel("symptoms_dataset_lowercase.xlsx", index=False)

print("File saved as 'symptoms_dataset_lowercase.xlsx'")
