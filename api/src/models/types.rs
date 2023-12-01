use diesel::{r2d2, SqliteConnection};
use diesel::r2d2::ConnectionManager;

pub type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;