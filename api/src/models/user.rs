use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::users;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = users)]
pub struct User {
    pub id: String,
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: String,
    pub phone: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewUser {
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: String,
    pub phone: String,
    pub email: String,
    pub password: String,
}