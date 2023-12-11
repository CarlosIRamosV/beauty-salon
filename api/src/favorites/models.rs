use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::favorites;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = favorites)]
pub struct Favorite {
    pub id: String,
    pub user_id: String,
    pub product_id: String,
}

impl Favorite {
    pub fn to_public(&self) -> Public {
        Public {
            id: self.id.clone(),
            product_id: self.product_id.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Public {
    pub id: String,
    pub product_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct New {
    pub user_id: Option<String>,
    pub product_id: String,
}
