use chrono::Utc;
use diesel::prelude::*;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};

use crate::auth::models::Claims;
use crate::user::models::User;

pub fn login(
    conn: &mut SqliteConnection,
    user_email: &str,
    pass: Option<&str>,
    remember_me: bool,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
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

    let exp = if remember_me {
        (Utc::now().timestamp() + 60 * 60 * 24 * 31) as usize // 31 days
    } else {
        (Utc::now().timestamp() + 60 * 60 * 24) as usize // 1 day
    };

    let my_claims = Claims { sub: user.id, exp };

    let token = encode(
        &Header::default(),
        &my_claims,
        &EncodingKey::from_secret("secret".as_ref()),
    )?;

    Ok(token)
}

pub fn is_admin(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Admin" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_employee(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Employee" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_user(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "User" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_admin_or_employee(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Admin" || user.type_ == "Employee" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_admin_or_user(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Admin" || user.type_ == "User" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_employee_or_user(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Employee" || user.type_ == "User" {
        return Ok(true);
    }
    Ok(false)
}

pub fn is_admin_or_employee_or_user(conn: &mut SqliteConnection, token: &str) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    let token = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::default(),
    )?;

    if token.claims.exp < Utc::now().timestamp() as usize {
        return Err("Token expired".into());
    }

    use crate::schema::users::dsl::*;

    let user = users.filter(id.eq(token.claims.sub)).first::<User>(conn)?;

    if user.type_ == "Admin" || user.type_ == "Employee" || user.type_ == "User" {
        return Ok(true);
    }
    Ok(false)
}