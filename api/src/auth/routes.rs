use crate::auth::actions;
use crate::auth::models::Config;
use crate::{user, Pool};
use actix_web::http::header::Header;
use actix_web::{error, get, post, web, HttpRequest, HttpResponse, Responder};
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

#[get("/session")]
pub async fn get_session(
    pool: web::Data<Pool>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let user = web::block(move || {
        let mut conn = pool.get()?;

        let user_id = actions::get_user_id(&mut conn, auth.as_ref().token())?;

        user::actions::find_user_by_uid(&mut conn, user_id.parse().unwrap())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(user))
}
