/**
 * order-customer-card controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order-customer-card.order-customer-card', ({ strapi }) => ({
  async deleteByDocumentId(ctx) {
    try {
      const { documentId } = ctx.params

      if (!documentId) {
        return ctx.badRequest('documentId is required')
      }

      // Tìm order_customer_card bằng documentId
      const orderCard = await strapi.documents('api::order-customer-card.order-customer-card').findOne({
        documentId: documentId,
      })

      if (!orderCard) {
        return ctx.notFound('Order customer card not found')
      }

      // Xóa bằng documentId
      await strapi.documents('api::order-customer-card.order-customer-card').delete({
        documentId: documentId,
      })

      return ctx.send({ success: true, message: 'Order customer card deleted successfully' })
    } catch (error: any) {
      strapi.log.error('Error deleting order customer card:', error)
      return ctx.internalServerError(error?.message || 'Failed to delete order customer card')
    }
  },
}));

