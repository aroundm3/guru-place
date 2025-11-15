/**
 * order router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::order.order', {
  config: {
    checkout: {
      auth: false, // Có thể set true nếu cần authentication
      policies: [],
      middlewares: [],
    },
  },
});
