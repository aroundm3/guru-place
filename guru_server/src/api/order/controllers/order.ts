/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async checkout(ctx) {
      try {
        const {
          customerId,
          items,
          customerCards,
          shippingFee = 15000,
          point = 0,
        } = ctx.request.body;

        // Validate input
        if (
          !customerId ||
          !items ||
          !Array.isArray(items) ||
          items.length === 0
        ) {
          return ctx.badRequest(
            "Missing required fields: customerId and items"
          );
        }

        // Validate customer exists
        const customer = await strapi.entityService.findOne(
          "api::customer.customer",
          customerId
        );
        if (!customer) {
          return ctx.notFound("Customer not found");
        }

        // Validate và tính toán tổng tiền, đồng thời kiểm tra số lượng
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
          const { productId, variantId, quantity } = item;

          if (!productId || !quantity || quantity <= 0) {
            return ctx.badRequest("Invalid item data");
          }

          // Lấy product
          const product = await strapi.entityService.findOne(
            "api::product.product",
            productId,
            {
              populate: ["variants"],
            }
          );

          if (!product) {
            return ctx.notFound(`Product ${productId} not found`);
          }

          let variant = null;
          let itemPrice = product.sale_price;
          let itemBasePrice = product.base_price;

          // Nếu có variantId, lấy variant
          if (variantId) {
            variant = await strapi.entityService.findOne(
              "api::variant.variant",
              variantId,
              {
                populate: ["product"],
              }
            );

            if (!variant) {
              return ctx.notFound(`Variant ${variantId} not found`);
            }

            // Kiểm tra variant thuộc product này
            if (variant.product?.id !== productId) {
              return ctx.badRequest(
                `Variant ${variantId} does not belong to product ${productId}`
              );
            }

            itemPrice = variant.sale_price;
            itemBasePrice = variant.base_price;

            // Kiểm tra số lượng variant
            if (variant.quantity < quantity) {
              return ctx.badRequest(
                `Insufficient quantity for variant ${variantId}. Available: ${variant.quantity}, Requested: ${quantity}`
              );
            }
          } else {
            // Không có variant, kiểm tra số lượng product
            if (product.quantity < quantity) {
              return ctx.badRequest(
                `Insufficient quantity for product ${productId}. Available: ${product.quantity}, Requested: ${quantity}`
              );
            }
          }

          totalAmount += itemPrice * quantity;

          orderItemsData.push({
            productId,
            variantId,
            quantity,
            price: itemPrice,
            basePrice: itemBasePrice,
            variant,
            product,
          });
        }

        // Tạo order
        const order = await strapi.entityService.create("api::order.order", {
          data: {
            customer: customerId,
            shipping_fee: shippingFee,
            point: point,
            publishedAt: new Date(),
          },
        });

        // Tạo order items và trừ số lượng
        for (const itemData of orderItemsData) {
          // Tạo order item
          await strapi.entityService.create("api::order-item.order-item", {
            data: {
              order: order.id,
              variant: itemData.variantId || null,
              quantity: itemData.quantity,
              publishedAt: new Date(),
            },
          });

          // Trừ số lượng
          if (itemData.variantId && itemData.variant) {
            // Có variant: trừ số lượng variant VÀ product
            await strapi.entityService.update(
              "api::variant.variant",
              itemData.variantId,
              {
                data: {
                  quantity: itemData.variant.quantity - itemData.quantity,
                  sold_quantity:
                    (itemData.variant.sold_quantity || 0) + itemData.quantity,
                },
              }
            );

            // Trừ số lượng product
            await strapi.entityService.update(
              "api::product.product",
              itemData.productId,
              {
                data: {
                  quantity: itemData.product.quantity - itemData.quantity,
                  sold_quantity:
                    (itemData.product.sold_quantity || 0) + itemData.quantity,
                },
              }
            );
          } else {
            // Không có variant: chỉ trừ số lượng product
            await strapi.entityService.update(
              "api::product.product",
              itemData.productId,
              {
                data: {
                  quantity: itemData.product.quantity - itemData.quantity,
                  sold_quantity:
                    (itemData.product.sold_quantity || 0) + itemData.quantity,
                },
              }
            );
          }
        }

        // Tạo order customer cards nếu có
        if (
          customerCards &&
          Array.isArray(customerCards) &&
          customerCards.length > 0
        ) {
          for (const cardData of customerCards) {
            const { cardId, quantity: cardQuantity } = cardData;

            if (!cardId || !cardQuantity || cardQuantity <= 0) {
              continue; // Skip invalid card data
            }

            // Validate card exists
            const card = await strapi.entityService.findOne(
              "api::customer-card.customer-card",
              cardId
            );
            if (!card) {
              continue; // Skip if card not found
            }

            await strapi.entityService.create(
              "api::order-customer-card.order-customer-card",
              {
                data: {
                  order: order.id,
                  customer_card: cardId,
                  quantity: cardQuantity,
                  publishedAt: new Date(),
                },
              }
            );
          }
        }

        // Lấy order đầy đủ với relations để trả về
        const fullOrder = await strapi.entityService.findOne(
          "api::order.order",
          order.id,
          {
            populate: {
              customer: true,
              order_items: {
                populate: {
                  variant: {
                    populate: {
                      product: true,
                    },
                  },
                },
              },
              order_customer_cards: {
                populate: {
                  customer_card: true,
                },
              },
            },
          }
        );

        return ctx.send({
          success: true,
          data: fullOrder,
          message: "Order created successfully",
        });
      } catch (error) {
        strapi.log.error("Checkout error:", error);
        return ctx.internalServerError("Failed to create order", {
          error: error.message,
        });
      }
    },
  })
);
