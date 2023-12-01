use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::jwt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Login {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = jwt)]
pub struct Jwt {
    pub id: String,
    pub user_id: String,
    pub token: String,
    pub created_at: String,
}