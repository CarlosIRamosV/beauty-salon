use diesel::prelude::*;

use crate::user::models::User;

pub fn login(
    conn: &mut SqliteConnection,
    user_email: &str,
    pass: Option<&str>,
    remember_me: bool,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    if user_email.is_empty() {
        return Err("Email is required".into());
    }

    // Find user by email
    let user = users.filter(email.eq(user_email)).first::<User>(conn)?;

    // Check if password is correct using bcrypt
    if let Some(pass) = pass {
        if !bcrypt::verify(pass, &user.password_hash).unwrap() {
            return Err("Password is incorrect".into());
        }
    } else {
        return Err("Password is required".into());
    }

    // TODO: Generate JWT token

    Ok(())
}
