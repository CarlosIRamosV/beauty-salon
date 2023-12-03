use diesel::prelude::*;
use uuid::Uuid;

use crate::models::products::Product;
use crate::resources::actions::insert_new_image;

pub fn find_all_products(
    conn: &mut SqliteConnection,
) -> Result<Vec<Product>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    let product = products.load::<Product>(conn)?;

    Ok(product)
}

pub fn find_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Product>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    let product = products
        .filter(id.eq(uid.to_string()))
        .first::<Product>(conn)
        .optional()?;

    Ok(product)
}

pub fn insert_new_product(
    conn: &mut SqliteConnection,
    nm: &str,
    desc: &str,
    prc: f64,
    qty: i32,
    img: &String,
) -> Result<Product, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    let new_image = insert_new_image(conn, img)?;

    let new_product = Product {
        id: Uuid::new_v4().to_string(),
        name: nm.to_owned(),
        description: desc.to_owned(),
        price: prc,
        quantity: qty,
        image_id: new_image.id.to_owned(),
    };

    diesel::insert_into(products).values(&new_product).execute(conn)?;

    Ok(new_product)
}
