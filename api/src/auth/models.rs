use serde::{Deserialize, Serialize};
use crate::user::models::Public;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub remember_me: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Token {
    pub access_token: String,
    pub user: Public,
}
