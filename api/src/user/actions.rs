use diesel::prelude::*;
use uuid::Uuid;

use crate::user::models::{New, Public, User};

pub fn find_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<User>(conn)
        .optional()?;

    let user = match user {
        Some(user) => user,
        None => return Err("No user found".into()),
    };

    Ok(Some(user.to_public()))
}

pub fn insert_new_user(
    conn: &mut SqliteConnection,
    data: New,
) -> Result<Public, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let new_user = User {
        id: Uuid::new_v4().to_string(),
        type_: "User".to_string(),
        name: data.name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        sex: data.sex,
        phone: data.phone,
        email: data.email,
        password: bcrypt::hash(data.password, bcrypt::DEFAULT_COST)?,
    };

    diesel::insert_into(users).values(&new_user).execute(conn)?;

    Ok(new_user.to_public())
}

