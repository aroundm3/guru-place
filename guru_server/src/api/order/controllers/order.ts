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

        const filtersFromQuery = query.filters || {};
        const filters = {
          ...filtersFromQuery,
          customer: {
            ...(filtersFromQuery.customer || {}),
            documentId: customerId, // Filter bằng documentId của customer
          },
          // Tạm thời bỏ filter publishedAt để test
          // publishedAt: {
          //   $notNull: true, // Chỉ lấy published orders
          // },
        };
        delete query.filters;

        const start = (page - 1) * pageSize;

        const [orders, total] = await Promise.all([
          strapi.entityService.findMany("api::order.order", {
            filters,
            populate: {
              customer: true,
            },
            sort: sortParam,
            limit: pageSize,
            start,
          }),
          strapi.entityService.count("api::order.order", {
            filters,
          }),
        ]);

        const ordersArray = Array.isArray(orders) ? orders : [orders];

        strapi.log.info("Query results:", {
          ordersFound: ordersArray.length,
          total,
          customerId,
          page,
          pageSize,
        });
        const orderIds = ordersArray.map((order: any) => order.id);
        strapi.log.info("Fetching order items and cards for orders:", orderIds);
        let orderItemsMap: Record<number, any[]> = {};
        let orderCardsMap: Record<number, any[]> = {};

        if (orderIds.length > 0) {
          strapi.log.info(
            "Querying order items and cards for orderIds:",
            orderIds
          );

          // Query tất cả order items và cards, rồi filter trong code
          // Vì filter relation có thể không hoạt động đúng, query tất cả rồi filter sẽ đảm bảo
          // Tạm thời bỏ filter publishedAt để test
          const [allOrderItems, allOrderCustomerCards] = await Promise.all([
            strapi.entityService.findMany("api::order-item.order-item", {
              populate: {
                order: true,
                variant: {
                  populate: ["product", "variant_image"],
                },
              },
              limit: 10000, // Query tất cả
            }),
            strapi.entityService.findMany(
              "api::order-customer-card.order-customer-card",
              {
                populate: {
                  order: true,
                  customer_card: {
                    populate: ["image"],
                  },
                },
                limit: 10000, // Query tất cả
              }
            ),
          ]);

          strapi.log.info(
            `Total order items in DB: ${Array.isArray(allOrderItems) ? allOrderItems.length : 0}, Total order cards in DB: ${Array.isArray(allOrderCustomerCards) ? allOrderCustomerCards.length : 0}`
          );

          // Filter trong code bằng orderIds
          const allOrderItemsArray = Array.isArray(allOrderItems)
            ? allOrderItems
            : [];
          const allOrderCustomerCardsArray = Array.isArray(
            allOrderCustomerCards
          )
            ? allOrderCustomerCards
            : [];

          // Debug: Log sample item để xem structure
          if (allOrderItemsArray.length > 0) {
            const sampleItem = allOrderItemsArray[0] as any;
            strapi.log.info(
              `Sample order item: id=${sampleItem.id}, order=${JSON.stringify(sampleItem.order)}, orderType=${typeof sampleItem.order}`
            );
            strapi.log.info(
              `orderIds to match:`,
              orderIds,
              `type:`,
              typeof orderIds[0]
            );
          }

          const orderItems = allOrderItemsArray.filter((item: any) => {
            // Thử nhiều cách để lấy order.id
            let oid: number | null = null;

            if (item.order) {
              if (typeof item.order === "object" && item.order !== null) {
                oid = item.order.id || null;
              } else if (typeof item.order === "number") {
                oid = item.order;
              }
            }

            // Convert cả hai về number để so sánh
            const orderIdsNumbers = orderIds.map((id: any) => Number(id));
            const oidNumber = oid !== null ? Number(oid) : null;

            const match =
              oidNumber !== null && orderIdsNumbers.includes(oidNumber);

            if (!match && oid !== null) {
              strapi.log.info(
                `Order item ${item.id} mismatch: oid=${oid} (${typeof oid}), orderIds=${JSON.stringify(orderIds)}`
              );
            }

            return match;
          });

          const orderCustomerCards = allOrderCustomerCardsArray.filter(
            (card: any) => {
              // Thử nhiều cách để lấy order.id
              let oid: number | null = null;

              if (card.order) {
                if (typeof card.order === "object" && card.order !== null) {
                  oid = card.order.id || null;
                } else if (typeof card.order === "number") {
                  oid = card.order;
                }
              }

              // Convert cả hai về number để so sánh
              const orderIdsNumbers = orderIds.map((id: any) => Number(id));
              const oidNumber = oid !== null ? Number(oid) : null;

              const match =
                oidNumber !== null && orderIdsNumbers.includes(oidNumber);
              return match;
            }
          );

          strapi.log.info(
            `Filtered: ${orderItems.length} order items and ${orderCustomerCards.length} order customer cards for ${orderIds.length} orders`
          );

          // Debug: Log một vài order items đã filter được
          if (orderItems.length > 0) {
            const sampleItem = orderItems[0] as any;
            strapi.log.info("Sample filtered order item:", {
              id: sampleItem.id,
              orderId: sampleItem.order?.id || sampleItem.order,
            });
          }
          if (orderCustomerCards.length > 0) {
            const sampleCard = orderCustomerCards[0] as any;
            strapi.log.info("Sample filtered order card:", {
              id: sampleCard.id,
              orderId: sampleCard.order?.id || sampleCard.order,
            });
          }

          orderItemsMap = orderItems.reduce(
            (acc, item: any) => {
              // Lấy order.id từ relation đã populate hoặc từ field trực tiếp
              const oid =
                typeof item.order === "object" && item.order?.id
                  ? item.order.id
                  : typeof item.order === "number"
                    ? item.order
                    : null;
              if (oid) {
                if (!acc[oid]) acc[oid] = [];
                acc[oid].push(item);
              }
              return acc;
            },
            {} as Record<number, any[]>
          );

          orderCardsMap = orderCustomerCards.reduce(
            (acc, card: any) => {
              // Lấy order.id từ relation đã populate hoặc từ field trực tiếp
              const oid =
                typeof card.order === "object" && card.order?.id
                  ? card.order.id
                  : typeof card.order === "number"
                    ? card.order
                    : null;
              if (oid) {
                if (!acc[oid]) acc[oid] = [];
                acc[oid].push(card);
              }
              return acc;
            },
            {} as Record<number, any[]>
          );

          strapi.log.info(
            `Mapped ${Object.keys(orderItemsMap).length} orders with items, ${Object.keys(orderCardsMap).length} orders with cards`
          );
        }

        const pageCount = Math.max(1, Math.ceil(total / pageSize));

        const enrichedOrders = ordersArray.map((order: any) => {
          const oid = order.id;
          return {
            ...order,
            order_items: orderItemsMap[oid] || [],
            order_customer_cards: orderCardsMap[oid] || [],
          };
        });

        ctx.body = {
          data: enrichedOrders,
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
          documentId: order.documentId,
          customerId: customer.id,
          shippingFee: order.shipping_fee,
        });

        // Publish order để đảm bảo order được publish trong Strapi v5
        // QUAN TRỌNG: Phải publish order TRƯỚC khi tạo order items để relation hoạt động
        if (order.documentId) {
          try {
            await strapi.documents("api::order.order").publish({
              documentId: order.documentId,
            });
            strapi.log.info("Order published successfully:", order.documentId);

            // Đợi một chút để đảm bảo publish hoàn tất
            await new Promise((resolve) => setTimeout(resolve, 200));

            // Query lại order đã publish để đảm bảo nó tồn tại và có thể dùng cho relation
            const publishedOrder = await strapi
              .documents("api::order.order")
              .findOne({
                documentId: order.documentId,
              });

            if (!publishedOrder) {
              throw new Error("Order not found after publishing");
            }

            strapi.log.info("Verified published order exists:", {
              id: publishedOrder.id,
              documentId: publishedOrder.documentId,
            });

            // Update order variable để dùng id từ published order
            order.id = publishedOrder.id;
          } catch (publishError: any) {
            strapi.log.error("Error publishing order:", publishError);
            throw publishError; // Throw error vì cần order được publish để tạo order items
          }
        } else {
          throw new Error("Order documentId is missing, cannot publish");
        }

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

            // Tạo order item - dùng strapi.documents().create() để đảm bảo relation hoạt động
            // Cần query variant để lấy id nếu có
            let variantIdForRelation = null;
            if (itemData.variant?.id) {
              variantIdForRelation = itemData.variant.id;
            } else if (itemData.variantId) {
              // Query variant bằng documentId để lấy id
              const variantDoc = await strapi
                .documents("api::variant.variant")
                .findOne({
                  documentId: itemData.variantId,
                });
              if (variantDoc) {
                variantIdForRelation = variantDoc.id;
              }
            }

            strapi.log.info("Creating order item with:", {
              orderId: order.id,
              variantId: variantIdForRelation,
              quantity: itemData.quantity,
            });

            const orderItem = await strapi
              .documents("api::order-item.order-item")
              .create({
                data: {
                  order: order.id, // Dùng id (integer) từ published order
                  variant: variantIdForRelation, // Dùng id (integer) cho relation
                  quantity: Number(itemData.quantity),
                  publishedAt: new Date(),
                },
              });

            strapi.log.info("Order item created successfully:", {
              orderItemId: orderItem.id,
              documentId: orderItem.documentId,
              orderId: order.id,
              variantId: itemData.variant?.id || null,
              quantity: orderItem.quantity,
            });

            // Publish order item
            if (orderItem.documentId) {
              try {
                await strapi.documents("api::order-item.order-item").publish({
                  documentId: orderItem.documentId,
                });
              } catch (publishError: any) {
                strapi.log.error("Error publishing order item:", publishError);
              }
            }
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

            const orderCustomerCard = await strapi
              .documents("api::order-customer-card.order-customer-card")
              .create({
                data: {
                  order: order.id, // Dùng id (integer) từ published order
                  customer_card: card.id, // Dùng id (integer) cho relation
                  quantity: cardQuantity,
                  publishedAt: new Date(),
                },
              });

            strapi.log.info("Order customer card created:", {
              orderCustomerCardId: orderCustomerCard.id,
              documentId: orderCustomerCard.documentId,
              cardId: card.id,
              quantity: orderCustomerCard.quantity,
            });

            // Publish order customer card
            if (orderCustomerCard.documentId) {
              try {
                await strapi
                  .documents("api::order-customer-card.order-customer-card")
                  .publish({
                    documentId: orderCustomerCard.documentId,
                  });
              } catch (publishError: any) {
                strapi.log.error(
                  "Error publishing order customer card:",
                  publishError
                );
              }
            }
          }
        } else {
          strapi.log.info("No customer cards to process");
        }

        // Lấy order đầy đủ với relations để trả về
        strapi.log.info("Fetching full order with relations...");

        // Query order items và customer cards manually vì populate có thể không hoạt động
        // Chỉ lấy published order items và cards
        const orderItems = await strapi.entityService.findMany(
          "api::order-item.order-item",
          {
            filters: {
              order: {
                id: {
                  $eq: order.id,
                },
              },
              publishedAt: {
                $notNull: true, // Chỉ lấy published
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
              publishedAt: {
                $notNull: true, // Chỉ lấy published
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
