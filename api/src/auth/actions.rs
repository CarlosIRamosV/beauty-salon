use diesel::prelude::*;

pub fn login(
    conn: &mut SqliteConnection,
    user_email: &str,
    pass: Option<&str>,
    remember: Option<bool>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;

    Ok(())
}
