use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::{roles, sex, users};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = roles)]
pub struct Role {
    pub id: i32,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = sex)]
pub struct Sex {
    pub id: i32,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(belongs_to(Role))]
#[diesel(belongs_to(Sex))]
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