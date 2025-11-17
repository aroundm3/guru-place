/**
 * order router
 */

const AUTH_CONFIG = {
  auth: {
    scope: ["api::order.order"],
  },
  policies: [],
  middlewares: [],
};

export default {
  routes: [
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
      config: AUTH_CONFIG,
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: AUTH_CONFIG,
    },
    {
      method: "GET",
      path: "/order/customer",
      handler: "order.listByCustomer",
      config: AUTH_CONFIG,
    },
    {
      method: "POST",
      path: "/order/checkout",
      handler: "order.checkout",
      config: AUTH_CONFIG,
    },
  ],
};
