use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use base64::Engine;
use base64::engine::general_purpose;
use diesel::prelude::*;
use uuid::Uuid;

use crate::models::images::Image;

pub fn find_image_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Image>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::images::dsl::*;

    let image = images
        .filter(id.eq(uid.to_string()))
        .first::<Image>(conn)
        .optional()?;

    Ok(image)
}

pub fn insert_new_image(
    conn: &mut SqliteConnection,
    img: &String,
) -> Result<Image, Box<dyn std::error::Error + Send + Sync>> {
    use crate::models::schema::images::dsl::*;

    let img_type = img.split(",").collect::<Vec<&str>>()[0].split(";").collect::<Vec<&str>>()[0].split(":").collect::<Vec<&str>>()[1];
    let img_data = img.split(",").collect::<Vec<&str>>()[1];

    let new_image = Image {
        id: Uuid::new_v4().to_string(),
        format: img_type.to_owned(),
        data: general_purpose::STANDARD.decode(img_data.as_bytes()).unwrap(),
        hash: calculate_hash(&img_data.as_bytes().to_vec()),
    };

    let check = images
        .filter(hash.eq(&new_image.hash))
        .first::<Image>(conn)
        .optional()?;

    if check.is_some() {
        return Ok(check.unwrap());
    }

    diesel::insert_into(images).values(&new_image).execute(conn)?;

    Ok(new_image)
}

fn calculate_hash(data: &Vec<u8>) -> String {
    let mut hasher = DefaultHasher::new();
    data.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}
