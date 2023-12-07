use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::{jwt, passwords, users};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = users)]
pub struct User {
    pub id: String,
    pub role_id: i32,
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex_id: i32,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = passwords)]
pub struct Password {
    pub user_id: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewUser {
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: i32,
    pub phone: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = jwt)]
pub struct Auth {
    pub id: String,
    pub user_id: String,
    pub token: String,
    pub expiration_date: chrono::NaiveDate,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub remember_me: Option<bool>,
}
