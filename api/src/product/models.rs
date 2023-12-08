use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::products;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = products)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub stock: i32,
    pub image_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct New {
    pub name: String,
    pub description: String,
    pub price: f64,
    pub stock: Option<i32>,
    pub image: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Update {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f64>,
    pub stock: Option<i32>,
    pub image: Option<String>,
}
