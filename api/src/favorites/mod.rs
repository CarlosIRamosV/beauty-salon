use actix_web::web;

pub(crate) mod actions;
mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::add_favorite);
    cfg.service(routes::delete_favorite);
}
