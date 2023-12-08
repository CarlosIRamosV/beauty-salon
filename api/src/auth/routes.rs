use crate::auth::actions;
use crate::auth::models::Config;
use crate::Pool;
use actix_web::http::header::Header;
use actix_web::{error, post, web, HttpRequest, HttpResponse, Responder};
use actix_web_httpauth::headers::authorization::{Authorization, Basic, Bearer};

#[post("/login")]
pub async fn login(
    pool: web::Data<Pool>,
    form: Option<web::Json<Config>>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Basic>::parse(&req)?;
    let token = web::block(move || {
        let mut conn = pool.get()?;

        actions::login(
            &mut conn,
            auth.as_ref().user_id(),
            auth.as_ref().password(),
            form.map(|c| c.remember_me).unwrap_or(false),
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(token))
}

#[post("/validate")]
pub async fn validate(
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let claims = web::block(move || {
        actions::validate(
            auth.as_ref().token(),
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(claims))
}
