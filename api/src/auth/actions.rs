use diesel::prelude::*;

use crate::auth::models::{Auth, Password, User};
use crate::schema;

pub fn login(
    conn: &mut SqliteConnection,
    user_email: &str,
    pass: Option<&str>,
    remember: Option<bool>,
) -> Result<Auth, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(email.eq(user_email.to_string()))
        .first::<User>(conn)
        .optional()?;

    let user = match user {
        Some(user) => user,
        None => return Err("No user found".into()),
    };

    let check_pass = match pass {
        Some(pass) => pass,
        None => return Err("No password provided".into()),
    };

    use crate::schema::passwords::dsl::*;

    let _user_password = passwords
        .filter(user_id.eq(user.id.to_string()))
        .first::<Password>(conn)
        .optional()?;

    let user_password = match _user_password {
        Some(user_password) => user_password,
        None => return Err("No password found".into()),
    };

    if user_password.password != check_pass.to_string() {
        return Err("Wrong password".into());
    }

    // Generate token

    let mut expiration_date = chrono::Local::now().naive_local().date();

    if remember == Option::from(true) {
        expiration_date += chrono::Duration::days(31);
    } else {
        expiration_date += chrono::Duration::days(1);
    }

    let auth = Auth {
        id: uuid::Uuid::new_v4().to_string(),
        user_id: user.id.to_string(),
        token: "token".to_string(),
        expiration_date,
    };

    diesel::insert_into(schema::jwt::table)
        .values(&auth)
        .execute(conn)?;

    Ok(auth)
}
