export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: `http://${env("APP_URL")}`, // 👈 Thêm http:// ở đây
  app: {
    keys: env.array("APP_KEYS"),
  },
});
