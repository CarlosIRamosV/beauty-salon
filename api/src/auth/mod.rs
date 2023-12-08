use actix_web::web;

mod actions;
mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::login);
    cfg.service(routes::validate);
}
