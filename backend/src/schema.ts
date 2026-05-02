import { pgTable, serial, integer, text, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull(),
  ageGroup: text('age_group').notNull(),
  description: text('description'),
});

export const bundles = pgTable('bundles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image').notNull(),
});

export const bundleItems = pgTable('bundle_items', {
  id: serial('id').primaryKey(),
  bundleId: integer('bundle_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
});

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
  bundle: one(bundles, {
    fields: [bundleItems.bundleId],
    references: [bundles.id],
  }),
  product: one(products, {
    fields: [bundleItems.productId],
    references: [products.id],
  }),
}));

export const bundlesRelations = relations(bundles, ({ many }) => ({
  items: many(bundleItems),
}));

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status', { enum: ['new', 'processing', 'paid', 'delivered', 'cancelled'] }).default('new'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  bundleId: integer('bundle_id'),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  bundle: one(bundles, {
    fields: [orderItems.bundleId],
    references: [bundles.id],
  })
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));
