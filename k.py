import tkinter as tk
from tkinter import messagebox
import requests

def send_message():
    webhook = webhook_entry.get()
    message = message_entry.get("1.0", tk.END).strip()
    
    if not webhook or not message:
        messagebox.showerror("Błąd", "Webhook i wiadomość nie mogą być puste!")
        return
    
    data = {"content": message}
    
    try:
        response = requests.post(webhook, json=data)
        if response.status_code == 204:
            messagebox.showinfo("Sukces", "Wiadomość została wysłana!")
        else:
            messagebox.showerror("Błąd", f"Błąd podczas wysyłania wiadomości: {response.status_code}")
    except Exception as e:
        messagebox.showerror("Błąd", f"Wystąpił błąd: {str(e)}")

# Tworzenie głównego okna
root = tk.Tk()
root.title("Wysyłanie wiadomości na webhook")

# Etykieta i pole do wpisania webhooka
tk.Label(root, text="Webhook:").pack(pady=5)
webhook_entry = tk.Entry(root, width=50)
webhook_entry.pack(pady=5)

# Etykieta i pole do wpisania wiadomości
tk.Label(root, text="Wiadomość:").pack(pady=5)
message_entry = tk.Text(root, height=10, width=50)
message_entry.pack(pady=5)

# Przycisk wysyłania
send_button = tk.Button(root, text="Wyślij", command=send_message)
send_button.pack(pady=10)

# Start aplikacji
root.mainloop()
