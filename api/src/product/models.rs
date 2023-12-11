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

impl Product {
    pub fn to_favorite(&self, favorite: bool) -> ProductWithFavorite {
        ProductWithFavorite {
            id: self.id.to_owned(),
            name: self.name.to_owned(),
            description: self.description.to_owned(),
            price: self.price,
            stock: self.stock,
            image_id: self.image_id.to_owned(),
            favorite,
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductWithFavorite {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub stock: i32,
    pub image_id: Option<String>,
    pub favorite: bool,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Search {
    pub name: Option<String>,
    pub description: Option<String>,
    pub min_price: Option<f64>,
    pub max_price: Option<f64>,
}
