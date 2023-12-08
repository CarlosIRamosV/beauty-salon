use actix_web::{error, get, post, web, HttpResponse, Responder, HttpRequest};
use actix_web::http::header::Header;
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

use crate::resources::actions;
use crate::resources::models::New;
use crate::{auth, Pool};

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
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let image = web::block(move || {
        let mut conn = pool.get()?;
        if let Err(_) = auth::actions::validate(auth.as_ref().token()) {
            return Err("Token expired".into());
        }

        // Check if user is admin
        let is_admin = auth::actions::is_admin(&mut conn, auth.as_ref().token())?;

        if !is_admin {
            return Err("User is not admin".into());
        }

        actions::insert_new_image(&mut conn, &form.image)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(image))
}
