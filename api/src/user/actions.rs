use diesel::prelude::*;
use uuid::Uuid;

use crate::user::models;

pub fn find_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<models::User>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<models::User>(conn)
        .optional()?;

    Ok(user)
}

pub fn insert_new_user(
    conn: &mut SqliteConnection,
    nm: &str,
    last_nm: &str,
    birth: &str,
    sx: i32,
    ph: &str,
    em: &str,
    pass: &str,
) -> Result<models::User, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::{passwords::dsl::*, users::dsl::*};

    let new_user = models::User {
        id: Uuid::new_v4().to_string(),
        role_id: 2,
        name: nm.to_owned(),
        last_name: last_nm.to_owned(),
        birth_date: birth.to_owned(),
        sex_id: sx,
        phone: ph.to_owned(),
        email: em.to_owned(),
    };

    let new_password = models::Password {
        user_id: new_user.id.to_owned(),
        password: pass.to_owned(),
    };

    diesel::insert_into(users).values(&new_user).execute(conn)?;
    diesel::insert_into(passwords)
        .values(&new_password)
        .execute(conn)?;

    Ok(new_user)
}
