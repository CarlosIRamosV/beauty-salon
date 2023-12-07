use diesel::prelude::*;
use uuid::Uuid;

use crate::models::products::Product;
use crate::models::types::Message;

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

pub fn delete_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Message>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    let old_count = products.count().get_result::<i64>(conn)?;
    diesel::delete(products.filter(id.eq(uid.to_string()))).execute(conn)?;
    assert!(old_count > products.count().get_result::<i64>(conn)?);

    Ok(Some(Message {
        message: format!("Product with UID: {} was deleted", uid),
    }))
}

pub fn update_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
    nm: &Option<String>,
    desc: &Option<String>,
    prc: Option<f64>,
    qty: Option<i32>,
    img: &Option<String>,
) -> Result<Product, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    if nm.is_none() && desc.is_none() && prc.is_none() && qty.is_none() && img.is_none() {
        return Err("No fields to update".into());
    }

    let product = products
        .filter(id.eq(uid.to_string()))
        .first::<Product>(conn)
        .optional()?;

    let mut product = match product {
        Some(product) => product,
        None => return Err("No product found".into()),
    };

    if let Some(nm) = nm {
        product.name = nm.to_owned();
    }

    if let Some(desc) = desc {
        product.description = desc.to_owned();
    }

    if let Some(prc) = prc {
        product.price = prc;
    }

    if let Some(qty) = qty {
        product.quantity = qty;
    }

    if let Some(img) = img {
        product.image_id = Some(img.to_owned());
    }

    diesel::update(products.filter(id.eq(uid.to_string())))
        .set((
            name.eq(product.name.to_owned()),
            description.eq(product.description.to_owned()),
            price.eq(product.price),
            quantity.eq(product.quantity),
            image_id.eq(product.image_id.to_owned())
        ))
        .execute(conn)?;

    Ok(product)
}

pub fn insert_new_product(
    conn: &mut SqliteConnection,
    nm: &str,
    desc: &str,
    prc: f64,
    qty: i32,
    img: &Option<String>,
) -> Result<Product, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::products::dsl::*;

    let new_product = Product {
        id: Uuid::new_v4().to_string(),
        name: nm.to_owned(),
        description: desc.to_owned(),
        price: prc,
        quantity: qty,
        image_id: img.clone(),
    };

    diesel::insert_into(products).values(&new_product).execute(conn)?;

    Ok(new_product)
}
