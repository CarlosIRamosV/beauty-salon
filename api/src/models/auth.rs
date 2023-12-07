use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::jwt;
#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = jwt)]
pub struct Auth {
    pub id: String,
    pub user_id: String,
    pub token: String,
    pub expiration_date: chrono::NaiveDate,
}