use diesel::{r2d2, SqliteConnection};
use diesel::r2d2::ConnectionManager;
use serde::{Deserialize, Serialize};

pub type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub message: String,
}