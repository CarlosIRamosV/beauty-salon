use diesel::prelude::*;
use uuid::Uuid;

use crate::models;

pub fn find_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<models::user::User>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<models::user::User>(conn)
        .optional()?;

    Ok(user)
}

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert_new_user(
    conn: &mut SqliteConnection,
    nm: &str,
    last_nm: &str,
    birth: &str,
    sx: &str,
    ph: &str,
    em: &str,
    pass: &str,
) -> Result<models::user::User, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::users::dsl::*;

    let new_user = models::user::User {
        id: Uuid::new_v4().to_string(),
        name: nm.to_owned(),
        last_name: last_nm.to_owned(),

        birth_date: birth.to_owned(),
        sex: sx.to_owned(),
        phone: ph.to_owned(),
        email: em.to_owned(),
        password: pass.to_owned(),
    };

    diesel::insert_into(users).values(&new_user).execute(conn)?;

    Ok(new_user)
}
