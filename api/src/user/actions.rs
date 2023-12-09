use diesel::prelude::*;
use uuid::Uuid;

use crate::user::models::{New, Public, Search, Update, User};

pub fn find_all_users(
    conn: &mut SqliteConnection,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let list_users = users.load::<User>(conn)?;

    let public_users = list_users
        .into_iter()
        .map(|user| user.to_public())
        .collect::<Vec<Public>>();

    Ok(public_users)
}

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

pub fn find_users(
    conn: &mut SqliteConnection,
    search: Search,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users;

    // Filters
    let mut list_users = users::table::into_boxed(Default::default());

    if let Some(r#type) = search.r#type {
        list_users = list_users.filter(users::type_.eq(r#type));
    }

    if let Some(name) = search.name {
        list_users = list_users.filter(users::name.like(format!("%{}%", name)));
    }

    if let Some(last_name) = search.last_name {
        list_users = list_users.filter(users::last_name.like(format!("%{}%", last_name)));
    }

    if let Some(birth_date) = search.birth_date {
        list_users = list_users.filter(users::birth_date.eq(birth_date));
    }

    if let Some(sex) = search.sex {
        list_users = list_users.filter(users::sex.eq(sex));
    }

    if let Some(phone) = search.phone {
        list_users = list_users.filter(users::phone.eq(phone));
    }

    if let Some(email) = search.email {
        list_users = list_users.filter(users::email.eq(email));
    }

    let list_users = list_users.load::<User>(conn)?;

    let public_users = list_users
        .into_iter()
        .map(|user| user.to_public())
        .collect::<Vec<Public>>();

    Ok(public_users)
}

pub fn insert_new_user(
    conn: &mut SqliteConnection,
    data: New,
) -> Result<Public, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    // Check if user exists
    let user = users
        .filter(email.eq(&data.email))
        .first::<User>(conn)
        .optional()?;

    if user.is_some() {
        return Err("User already exists".into());
    }

    // Insert new user
    let new_user = User {
        id: Uuid::new_v4().to_string(),
        image_id: data.image_id,
        type_: "User".to_string(),
        name: data.name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        sex: data.sex,
        phone: data.phone,
        email: data.email,
        password_hash: bcrypt::hash(data.password, bcrypt::DEFAULT_COST)?,
    };

    diesel::insert_into(users).values(&new_user).execute(conn)?;

    Ok(new_user.to_public())
}

pub fn update_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
    update: Update,
    change_type: bool,
) -> Result<Public, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<User>(conn)
        .optional()?;

    let mut user = match user {
        Some(user) => user,
        None => return Err("No user found".into()),
    };

    // Update name
    if let Some(new_name) = update.name {
        user.name = new_name.to_owned();
    }

    // Update type
    if change_type {
        if let Some(r#type) = update.r#type {
            user.type_ = r#type.to_owned();
        }
    }

    // Update image_id
    if let Some(new_image_id) = update.image_id {
        user.image_id = Option::from(new_image_id.to_owned());
    }

    // Update last_name
    if let Some(new_last_name) = update.last_name {
        user.last_name = new_last_name.to_owned();
    }

    // Update birth_date
    if let Some(new_birth_date) = update.birth_date {
        user.birth_date = new_birth_date.to_owned();
    }

    // Update sex
    if let Some(new_sex) = update.sex {
        user.sex = new_sex.to_owned();
    }

    // Update phone
    if let Some(new_phone) = update.phone {
        user.phone = new_phone.to_owned();
    }

    // Update email
    if let Some(new_email) = update.email {
        user.email = new_email.to_owned();
    }

    // Update password
    if let Some(new_password) = update.password {
        user.password_hash = bcrypt::hash(new_password, bcrypt::DEFAULT_COST)?;
    }

    // Update user
    diesel::update(users.filter(id.eq(uid.to_string())))
        .set((
            type_.eq(&user.type_),
            image_id.eq(&user.image_id),
            name.eq(&user.name),
            last_name.eq(&user.last_name),
            sex.eq(&user.sex),
            phone.eq(&user.phone),
            email.eq(&user.email),
        ))
        .execute(conn)?;

    Ok(user.to_public())
}

pub fn delete_user_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    // Check if user exists
    let user = users
        .filter(id.eq(uid.to_string()))
        .first::<User>(conn)
        .optional()?;

    let _user = match user {
        Some(user) => user,
        None => return Err("No user found".into()),
    };

    diesel::delete(users.filter(id.eq(uid.to_string()))).execute(conn)?;

    Ok("User deleted".to_string())
}
