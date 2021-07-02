FROM denoland/deno:1.11.2

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-env", "app.ts"]