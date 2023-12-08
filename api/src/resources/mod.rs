use actix_web::web;

mod actions;
mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::add_image);
    cfg.service(routes::get_image);
}
