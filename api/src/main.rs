use std::env;
use std::error::Error;

use actix_web::{App, HttpServer, middleware, web};
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::sqlite::Sqlite;
use diesel::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;

use crate::user::{add_user, get_user};

mod models;
mod user;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Setup database connection pool
    let pool = initialize_db_pool();

    // Run migrations
    run_migrations(&mut *pool.get().unwrap()).unwrap();

    // Start HTTP server
    log::info!("starting API server at http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .service(get_user)
            .service(add_user)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}

pub fn initialize_db_pool() -> Pool<ConnectionManager<SqliteConnection>> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").unwrap_or("file:data.db".to_string());
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Could not build connection pool")
}

fn run_migrations(connection: &mut impl MigrationHarness<Sqlite>) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    connection.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}