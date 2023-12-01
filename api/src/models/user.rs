use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::{passwords, users};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(belongs_to(roles))]
#[diesel(belongs_to(sex))]
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
#[diesel(belongs_to(users))]
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