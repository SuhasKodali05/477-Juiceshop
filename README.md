# HW 2B - Juice Shop Security Login Form

This project is a simple Juice Shop-style login page for HW 2B. It includes email/password fields, client-side validation, server-side validation, and password hashing with Node's built-in `scrypt` function for the runnable demo.

## Run it

1. Install Node.js.
2. In this folder, run `node server.js`.
3. Open http://localhost:3000.

Test account: `student@example.com` / `Password123!`

## Security notes

The server validates the email and password instead of trusting browser validation. The demo stores a derived password hash instead of plaintext. In a production app, bcrypt or Argon2id would also be appropriate password-hashing choices.

For Part 3, `public/index.html` intentionally uses `innerHTML` when displaying a failed email. This creates a reflected XSS vulnerability so it can be tested safely on the local form. The fix is to use `textContent` instead.

## Part 3 XSS test

Enter this as the email:

`<script>alert('XSS')</script>@example.com`

Use `Password123!` as the password. The fake account is rejected by the server, and the vulnerable client code inserts the email as HTML, causing the script to execute. Replace the vulnerable `innerHTML` line with `textContent` to fix it.
