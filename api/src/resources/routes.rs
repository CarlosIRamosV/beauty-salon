use actix_web::{error, get, post, web, HttpResponse, Responder};
use uuid::Uuid;

use crate::resources::actions;
use crate::resources::models::New;
use crate::Pool;

#[get("/images/{image_id}")]
pub async fn get_image(
    pool: web::Data<Pool>,
    image_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let image_uid = image_uid.into_inner();
    let image = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_image_by_uid(&mut conn, image_uid)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(match image {
        Some(image) => HttpResponse::build(actix_web::http::StatusCode::OK)
            .content_type(image.format)
            .body(image.data),
        None => HttpResponse::NotFound().body(format!("No image found with UID: {image_uid}")),
    })
}

#[post("/images")]
pub async fn add_image(
    pool: web::Data<Pool>,
    form: web::Json<New>,
) -> actix_web::Result<impl Responder> {
    let image = web::block(move || {
        let mut conn = pool.get()?;
        actions::insert_new_image(&mut conn, &form.image)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(image))
}
