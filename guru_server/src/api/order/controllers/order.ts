/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async listByCustomer(ctx) {
      try {
        const query = ctx.request.query as Record<string, any>;
        const customerId = query.customerId as string;

        if (!customerId) {
          return ctx.badRequest("customerId is required");
        }

        const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const pageSize =
          Number(query.pageSize) > 0 ? Number(query.pageSize) : 10;

        const sortParam =
          typeof query.sort !== "undefined" ? query.sort : "createdAt:desc";

        // Remove custom params so they don't interfere with filters/populate parsing
        delete query.customerId;
        delete query.page;
        delete query.pageSize;
        delete query.sort;

        const defaultPopulate = {
          order_items: {
            populate: {
              variant: {
                populate: ["product"],
              },
              product: true,
            },
          },
          order_customer_cards: {
            populate: {
              customer_card: true,
            },
          },
          customer: true,
        };

        const populate = query.populate || defaultPopulate;
        delete query.populate;

        const filtersFromQuery = query.filters || {};
        const filters = {
          ...filtersFromQuery,
          customer: {
            ...(filtersFromQuery.customer || {}),
            documentId: customerId,
          },
        };

        const start = (page - 1) * pageSize;

        const [orders, total] = await Promise.all([
          strapi.entityService.findMany("api::order.order", {
            filters,
            populate,
            sort: sortParam,
            limit: pageSize,
            start,
          }),
          strapi.entityService.count("api::order.order", {
            filters,
          }),
        ]);

        const pageCount = Math.max(1, Math.ceil(total / pageSize));

        ctx.body = {
          data: orders,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount,
              total,
            },
          },
        };
      } catch (error: any) {
        strapi.log.error("Error fetching orders by customer:", error);
        return ctx.internalServerError("Failed to fetch orders", {
          error: error?.message || String(error),
        });
      }
    },
    async checkout(ctx) {
      try {
        strapi.log.info("Checkout request received:", ctx.request.body);

        const {
          customerId,
          items,
          customerCards,
          shippingFee,
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

        // Validate customer exists - tìm bằng documentId (string) thay vì id (integer)
        // Strapi v5 dùng strapi.documents() để query bằng documentId
        strapi.log.info("Looking for customer with documentId:", customerId);
        const customer = await strapi
          .documents("api::customer.customer")
          .findOne({
            documentId: customerId,
          });

        if (!customer) {
          strapi.log.error("Customer not found with documentId:", customerId);
          return ctx.notFound("Customer not found");
        }

        strapi.log.info("Customer found:", {
          id: customer.id,
          documentId: customer.documentId,
        });

        // Validate và tính toán tổng tiền, đồng thời kiểm tra số lượng
        let totalAmount = 0;
        let hasFreeShip = false;
        const orderItemsData = [];

        for (const item of items) {
          const { productId, variantId, quantity } = item;

          if (!productId || !quantity || quantity <= 0) {
            return ctx.badRequest("Invalid item data");
          }

          // Lấy product - tìm bằng documentId
          const product = await strapi
            .documents("api::product.product")
            .findOne({
              documentId: productId,
              populate: ["variants"],
            });

          if (!product) {
            return ctx.notFound(`Product ${productId} not found`);
          }

          let variant = null;
          let itemPrice = Number(product.sale_price);
          let itemBasePrice = Number(product.base_price);

          // Nếu có variantId, lấy variant - tìm bằng documentId
          if (variantId) {
            variant = await strapi.documents("api::variant.variant").findOne({
              documentId: variantId,
              populate: ["product"],
            });

            if (!variant) {
              return ctx.notFound(`Variant ${variantId} not found`);
            }

            // Kiểm tra variant thuộc product này
            const variantProductId =
              variant.product?.documentId || variant.product?.id;
            if (variantProductId && variantProductId !== productId) {
              return ctx.badRequest(
                `Variant ${variantId} does not belong to product ${productId}`
              );
            }

            itemPrice = Number(variant.sale_price);
            itemBasePrice = Number(variant.base_price);

            // Kiểm tra số lượng variant
            if (Number(variant.quantity) < quantity) {
              return ctx.badRequest(
                `Insufficient quantity for variant ${variantId}. Available: ${variant.quantity}, Requested: ${quantity}`
              );
            }
          } else {
            // Không có variant, kiểm tra số lượng product
            if (Number(product.quantity) < quantity) {
              return ctx.badRequest(
                `Insufficient quantity for product ${productId}. Available: ${product.quantity}, Requested: ${quantity}`
              );
            }
          }

          totalAmount += itemPrice * quantity;

          // Kiểm tra nếu product có isFreeShip = true
          if (product.isFreeShip === true) {
            hasFreeShip = true;
          }

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

        // Tính shipping fee: nếu có product isFreeShip thì = 0, mặc định = 15000
        const finalShippingFee = hasFreeShip ? 0 : (shippingFee ?? 15000);

        // Tạo order - dùng customer.id (integer) thay vì customerId (documentId string)
        strapi.log.info("Creating order with customerId:", customer.id);
        const order = await strapi.entityService.create("api::order.order", {
          data: {
            customer: customer.id, // Dùng id (integer) cho relation
            shipping_fee: Number(finalShippingFee),
            point: Number(point),
            publishedAt: new Date(),
          },
        });

        strapi.log.info("Order created:", {
          orderId: order.id,
          customerId: customer.id,
          shippingFee: order.shipping_fee,
        });

        // Tạo order items và trừ số lượng
        strapi.log.info(
          `Starting to create ${orderItemsData.length} order items`
        );
        for (let i = 0; i < orderItemsData.length; i++) {
          const itemData = orderItemsData[i];
          try {
            strapi.log.info(
              `Creating order item ${i + 1}/${orderItemsData.length}:`,
              {
                productId: itemData.productId,
                variantId: itemData.variantId,
                quantity: itemData.quantity,
                hasVariant: !!itemData.variant,
                variantIdForRelation: itemData.variant?.id || null,
                orderId: order.id,
              }
            );

            // Tạo order item - dùng variant.id (integer) thay vì variantId (documentId string)
            const orderItem = await strapi.entityService.create(
              "api::order-item.order-item",
              {
                data: {
                  order: order.id,
                  variant: itemData.variant?.id || null, // Dùng id (integer) cho relation
                  quantity: Number(itemData.quantity),
                  publishedAt: new Date(),
                },
              }
            );

            strapi.log.info("Order item created successfully:", {
              orderItemId: orderItem.id,
              orderId: order.id,
              variantId: itemData.variant?.id || null,
              quantity: orderItem.quantity,
            });
          } catch (itemError: any) {
            strapi.log.error(`Error creating order item ${i + 1}:`, {
              error: itemError.message,
              stack: itemError.stack,
              itemData: {
                productId: itemData.productId,
                variantId: itemData.variantId,
                quantity: itemData.quantity,
              },
            });
            throw itemError; // Re-throw để dừng process
          }

          // Trừ số lượng - dùng id (integer) thay vì documentId (string)
          try {
            if (itemData.variantId && itemData.variant) {
              // Có variant: trừ số lượng variant VÀ product
              const variantOldQuantity = Number(itemData.variant.quantity);
              const variantNewQuantity = variantOldQuantity - itemData.quantity;
              const variantOldSold = Number(
                itemData.variant.sold_quantity || 0
              );
              const variantNewSold = variantOldSold + itemData.quantity;

              strapi.log.info("Updating variant quantity:", {
                variantId: itemData.variant.id,
                oldQuantity: variantOldQuantity,
                newQuantity: variantNewQuantity,
                oldSold: variantOldSold,
                newSold: variantNewSold,
              });

              // Update variant bằng documentId
              await strapi.documents("api::variant.variant").update({
                documentId: itemData.variant.documentId,
                data: {
                  quantity: variantNewQuantity,
                  sold_quantity: variantNewSold,
                } as any,
              });

              // Publish variant
              await strapi.documents("api::variant.variant").publish({
                documentId: itemData.variant.documentId,
              });

              // Trừ số lượng product
              const productOldQuantity = Number(itemData.product.quantity);
              const productNewQuantity = productOldQuantity - itemData.quantity;
              const productOldSold = Number(
                itemData.product.sold_quantity || 0
              );
              const productNewSold = productOldSold + itemData.quantity;

              strapi.log.info("Updating product quantity (has variant):", {
                productId: itemData.product.id,
                oldQuantity: productOldQuantity,
                newQuantity: productNewQuantity,
                oldSold: productOldSold,
                newSold: productNewSold,
              });

              // Update product bằng documentId
              await strapi.documents("api::product.product").update({
                documentId: itemData.product.documentId,
                data: {
                  quantity: productNewQuantity,
                  sold_quantity: productNewSold,
                } as any,
              });

              // Publish product
              await strapi.documents("api::product.product").publish({
                documentId: itemData.product.documentId,
              });
            } else {
              // Không có variant: chỉ trừ số lượng product
              const productOldQuantity = Number(itemData.product.quantity);
              const productNewQuantity = productOldQuantity - itemData.quantity;
              const productOldSold = Number(
                itemData.product.sold_quantity || 0
              );
              const productNewSold = productOldSold + itemData.quantity;

              strapi.log.info("Updating product quantity (no variant):", {
                productId: itemData.product.id,
                oldQuantity: productOldQuantity,
                newQuantity: productNewQuantity,
                oldSold: productOldSold,
                newSold: productNewSold,
              });

              // Update product bằng documentId
              await strapi.documents("api::product.product").update({
                documentId: itemData.product.documentId,
                data: {
                  quantity: productNewQuantity,
                  sold_quantity: productNewSold,
                } as any,
              });

              // Publish product
              await strapi.documents("api::product.product").publish({
                documentId: itemData.product.documentId,
              });
            }
          } catch (updateError: any) {
            strapi.log.error("Error updating quantity:", {
              error: updateError.message,
              stack: updateError.stack,
              itemData: {
                productId: itemData.productId,
                variantId: itemData.variantId,
              },
            });
            throw updateError; // Re-throw để dừng process
          }
        }

        strapi.log.info(
          `Successfully created ${orderItemsData.length} order items`
        );

        // Verify order items were created
        const verifyOrderItems = await strapi.db
          .query("api::order-item.order-item")
          .findMany({
            where: {
              order: {
                id: order.id,
              },
            },
            limit: 100,
          });
        strapi.log.info(
          `Verified order items count: ${verifyOrderItems.length}`,
          {
            orderItems: verifyOrderItems.map((item: any) => ({
              id: item.id,
              order: item.order,
              variant: item.variant,
              quantity: item.quantity,
            })),
          }
        );

        // Tạo order customer cards nếu có
        if (
          customerCards &&
          Array.isArray(customerCards) &&
          customerCards.length > 0
        ) {
          strapi.log.info("Processing customer cards:", customerCards);

          for (const cardData of customerCards) {
            const { cardId, quantity: cardQuantity } = cardData;

            if (!cardId || !cardQuantity || cardQuantity <= 0) {
              strapi.log.warn("Skipping invalid card data:", cardData);
              continue; // Skip invalid card data
            }

            // Validate card exists - tìm bằng documentId
            const card = await strapi
              .documents("api::customer-card.customer-card")
              .findOne({
                documentId: cardId,
              });

            if (!card) {
              strapi.log.warn("Card not found:", cardId);
              continue; // Skip if card not found
            }

            strapi.log.info("Creating order customer card:", {
              cardId: card.id,
              documentId: card.documentId,
              quantity: cardQuantity,
            });

            const orderCustomerCard = await strapi.entityService.create(
              "api::order-customer-card.order-customer-card",
              {
                data: {
                  order: order.id,
                  customer_card: card.id, // Dùng id (integer) cho relation
                  quantity: cardQuantity,
                  publishedAt: new Date(),
                },
              }
            );

            strapi.log.info("Order customer card created:", {
              orderCustomerCardId: orderCustomerCard.id,
              cardId: card.id,
              quantity: orderCustomerCard.quantity,
            });
          }
        } else {
          strapi.log.info("No customer cards to process");
        }

        // Lấy order đầy đủ với relations để trả về
        strapi.log.info("Fetching full order with relations...");

        // Query order items và customer cards manually vì populate có thể không hoạt động
        const orderItems = await strapi.entityService.findMany(
          "api::order-item.order-item",
          {
            filters: {
              order: {
                id: {
                  $eq: order.id,
                },
              },
            },
            populate: {
              variant: {
                populate: {
                  product: true,
                },
              },
            },
            limit: 100,
          }
        );

        const orderCustomerCards = await strapi.entityService.findMany(
          "api::order-customer-card.order-customer-card",
          {
            filters: {
              order: {
                id: {
                  $eq: order.id,
                },
              },
            },
            populate: {
              customer_card: true,
            },
            limit: 100,
          }
        );

        // Lấy order với customer
        const fullOrder = await strapi.documents("api::order.order").findOne({
          documentId: order.documentId,
          populate: {
            customer: true,
          },
        });

        // Manually populate order_items và order_customer_cards
        const fullOrderAny = fullOrder as any;
        fullOrderAny.order_items = orderItems || [];
        fullOrderAny.order_customer_cards = orderCustomerCards || [];

        strapi.log.info("Full order fetched:", {
          orderId: fullOrderAny?.id,
          documentId: fullOrderAny?.documentId,
          orderItemsCount: fullOrderAny?.order_items?.length || 0,
          orderCustomerCardsCount:
            fullOrderAny?.order_customer_cards?.length || 0,
        });

        return ctx.send({
          success: true,
          data: fullOrderAny,
          message: "Order created successfully",
        });
      } catch (error: any) {
        strapi.log.error("Checkout error:", error);
        strapi.log.error("Checkout error stack:", error.stack);
        return ctx.internalServerError("Failed to create order", {
          error: error?.message || String(error),
        });
      }
    },
  })
);
