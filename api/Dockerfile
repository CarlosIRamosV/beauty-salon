FROM rust:latest as builder

RUN apt-get update
RUN apt-get install musl-tools -y
RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /usr/src/api
COPY . .

RUN cargo build --release --target x86_64-unknown-linux-musl
RUN ls -la target/x86_64-unknown-linux-musl/release

FROM alpine:latest
LABEL maintainer="Carlos Ramos"

COPY --from=builder /usr/src/api/target/x86_64-unknown-linux-musl/release/api /usr/local/bin/api-service

CMD ["api-service"]