use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::{products, images};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = images)]
pub struct Image {
    pub id: String,
    pub data: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = products)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub quantity: i32,
    pub image: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewProduct {
    pub name: String,
    pub description: String,
    pub price: f64,
    pub quantity: i32,
    pub image: String
}