use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::models::schema::images;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = images)]
pub struct Image {
    pub id: String,
    pub format: String,
    pub data: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewImage {
    pub image: String,
}