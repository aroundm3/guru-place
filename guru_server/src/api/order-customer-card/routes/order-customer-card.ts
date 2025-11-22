/**
 * order-customer-card router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/order-customer-cards",
      handler: "order-customer-card.find",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/order-customer-cards/:id",
      handler: "order-customer-card.findOne",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order-customer-cards",
      handler: "order-customer-card.create",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/order-customer-cards/:id",
      handler: "order-customer-card.update",
      config: {
        auth: false,
      },
    },
    {
      method: "DELETE",
      path: "/order-customer-cards/:id",
      handler: "order-customer-card.delete",
      config: {
        auth: false,
      },
    },
    {
      method: "DELETE",
      path: "/order-customer-cards/document/:documentId",
      handler: "order-customer-card.deleteByDocumentId",
      config: {
        auth: false,
      },
    },
  ],
};
