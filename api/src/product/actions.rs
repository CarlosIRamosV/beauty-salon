use diesel::prelude::*;
use uuid::Uuid;

use crate::product::models::{New, Product, Search, Update};

pub fn find_all_products(
    conn: &mut SqliteConnection,
) -> Result<Vec<Product>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products::dsl::*;

    let products_list = products.load::<Product>(conn)?;

    Ok(products_list)
}

pub fn find_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Product>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products::dsl::*;

    let product = products
        .filter(id.eq(uid.to_string()))
        .first::<Product>(conn)
        .optional()?;

    Ok(product)
}

pub fn delete_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<()>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products::dsl::*;

    let old_count = products.count().get_result::<i64>(conn)?;
    diesel::delete(products.filter(id.eq(uid.to_string()))).execute(conn)?;
    assert!(old_count > products.count().get_result::<i64>(conn)?);

    Ok(Option::from(()))
}

pub fn update_product_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
    update: Update,
) -> Result<Product, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products::dsl::*;

    let Update {
        name: nm,
        description: desc,
        price: prc,
        stock: qty,
        image: img,
    } = update;

    if nm.is_none() && desc.is_none() && prc.is_none() && qty.is_none() && img.is_none() {
        return Err("No update parameters provided".into());
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
        product.stock = qty;
    }

    if let Some(img) = img {
        product.image_id = Some(img.to_owned());
    }

    diesel::update(products.filter(id.eq(uid.to_string())))
        .set((
            name.eq(product.name.to_owned()),
            description.eq(product.description.to_owned()),
            price.eq(product.price),
            stock.eq(product.stock),
            image_id.eq(product.image_id.to_owned()),
        ))
        .execute(conn)?;

    Ok(product)
}

pub fn insert_new_product(
    conn: &mut SqliteConnection,
    product: New,
) -> Result<Product, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products::dsl::*;

    let new_product = Product {
        id: Uuid::new_v4().to_string(),
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock.unwrap_or(0),
        image_id: product.image,
    };

    diesel::insert_into(products)
        .values(&new_product)
        .execute(conn)?;

    Ok(new_product)
}

pub fn find_products(
    conn: &mut SqliteConnection,
    search: Search,
) -> Result<Vec<Product>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::products;

    let mut products = products::table::into_boxed(Default::default());

    if let Some(name) = search.name {
        products = products.filter(products::name.like(format!("%{}%", name)));
    }
    if let Some(description) = search.description {
        products = products.filter(products::description.like(format!("%{}%", description)));
    }
    // Price less than or equal to the given price
    if let Some(price) = search.price {
        products = products.filter(products::price.le(price));
    }

    products = products.order_by(products::name.asc());

    let products = products.load::<Product>(conn)?;

    Ok(products)
}
