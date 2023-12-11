use diesel::prelude::*;
use uuid::Uuid;
use crate::favorites::models::{Favorite, New, Public};

pub fn insert_new_favorite(
    conn: &mut SqliteConnection,
    new: New,
) -> Result<Public, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::favorites::dsl::*;

    let new_favorite = Favorite {
        id: Uuid::new_v4().to_string(),
        user_id: new.user_id.unwrap_or("".to_string()),
        product_id: new.product_id,
    };

    diesel::insert_into(favorites)
        .values(&new_favorite)
        .execute(conn)?;

    Ok(new_favorite.to_public())
}

pub fn delete_favorite_by_uid(
    conn: &mut SqliteConnection,
    user_uid: String,
    product_uid: String,
) -> Result<Option<()>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::favorites::dsl::*;

    let old_count = favorites.count().get_result::<i64>(conn)?;
    diesel::delete(favorites.filter(user_id.eq(user_uid)).filter(product_id.eq(product_uid))).execute(conn)?;
    assert!(old_count > favorites.count().get_result::<i64>(conn)?);

    Ok(Option::from(()))
}

pub fn is_favorite(
    conn: &mut SqliteConnection,
    user_uid: String,
    product_uid: String,
) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::favorites::dsl::*;

    let favorite = favorites
        .filter(user_id.eq(user_uid))
        .filter(product_id.eq(product_uid))
        .first::<Favorite>(conn)
        .optional()?;

    Ok(favorite.is_some())
}