use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::jwt;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = jwt)]
pub struct JWT {
    pub id: String,
    pub user_id: String,
    pub token: String,
    pub expiration_date: chrono::NaiveDate,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub remember_me: bool,
}

pub struct Token {
    pub token: String,
    pub expiration_date: chrono::NaiveDate,
}

impl Token {
    pub fn new(token: String, expiration_date: chrono::NaiveDate) -> Self {
        Self {
            token,
            expiration_date,
        }
    }
}
