import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { products, bundles, orders, orderItems, bundleItems } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API: Get products
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API: Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, category, ageGroup, description } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const [newProduct] = await db.insert(products).values({
      name,
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80', // default image
      category,
      ageGroup: ageGroup || 'all',
      description: description || ''
    }).returning();

    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// API: Get bundles (with their items)
app.get('/api/bundles', async (req, res) => {
  try {
    const allBundles = await db.query.bundles.findMany({
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    res.json(allBundles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bundles' });
  }
});

// API: Get a single bundle with items
app.get('/api/bundles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bundle = await db.query.bundles.findFirst({
      where: eq(bundles.id, parseInt(id)),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    if (!bundle) return res.status(404).json({ error: 'Bundle not found' });
    res.json(bundle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bundle' });
  }
});

// API: Create a bundle
app.post('/api/bundles', async (req, res) => {
  try {
    const { name, price, image, description, items } = req.body;
    
    if (!name || !price || !items || !items.length) {
      return res.status(400).json({ error: 'Name, price, and items are required' });
    }

    const [newBundle] = await db.insert(bundles).values({
      name,
      price: parseFloat(price),
      image,
      description: description || ''
    }).returning();

    const bundleId = newBundle.id;

    // Insert items
    const bundleItemsData = items.map((item: any) => ({
      bundleId,
      productId: item.productId,
      quantity: item.quantity || 1
    }));

    await db.insert(bundleItems).values(bundleItemsData);

    res.json({ success: true, bundle: newBundle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create bundle' });
  }
});

// API: Delete a bundle
app.delete('/api/bundles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(bundleItems).where(eq(bundleItems.bundleId, parseInt(id)));
    await db.delete(bundles).where(eq(bundles.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bundle' });
  }
});

// API: Update a bundle
app.put('/api/bundles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, description, items } = req.body;
    
    if (!name || !price || !items || !items.length) {
      return res.status(400).json({ error: 'Name, price, and items are required' });
    }

    const bundleId = parseInt(id);

    // Update bundle info
    await db.update(bundles).set({
      name,
      price: parseFloat(price),
      image,
      description: description || ''
    }).where(eq(bundles.id, bundleId));

    // Update items: delete old ones and insert new ones
    await db.delete(bundleItems).where(eq(bundleItems.bundleId, bundleId));
    
    const bundleItemsData = items.map((item: any) => ({
      bundleId,
      productId: item.productId,
      quantity: item.quantity || 1
    }));

    await db.insert(bundleItems).values(bundleItemsData);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update bundle' });
  }
});

// API: Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, items, totalPrice } = req.body;
    
    if (!customerName || !phone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert order
    const [result] = await db.insert(orders).values({
      customerName,
      phone,
      address,
      totalPrice,
      createdAt: new Date().toISOString()
    }).returning({ id: orders.id });

    const orderId = result.id;

    // Insert order items
    const orderItemsData = items.map((item: any) => ({
      orderId,
      productId: item.productId || null,
      bundleId: item.bundleId || null,
      quantity: item.quantity,
      price: item.price
    }));

    await db.insert(orderItems).values(orderItemsData);

    res.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// API: Admin Get Orders
app.get('/api/orders', async (req, res) => {
  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        items: {
          with: {
            product: true,
            bundle: true
          }
        }
      }
    });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// API: Admin Update Order Status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.update(orders).set({ status }).where(eq(orders.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// API: Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(products).where(eq(products.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// API: Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category, ageGroup, description } = req.body;
    
    await db.update(products).set({
      name,
      price: parseFloat(price),
      image,
      category,
      ageGroup,
      description
    }).where(eq(products.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Route to seed db with sample products
app.post('/api/seed', async (req, res) => {
  try {
    const exist = await db.select().from(products).limit(1);
    if (exist.length > 0) return res.json({ message: 'Already seeded' });

    // Seed 12 products across categories
    const [p1]  = await db.insert(products).values({ name: 'حفاضات نيوبورن برميوم', price: 25.00, image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80', category: 'مستلزمات المولود', ageGroup: '0-6 months', description: 'حفاضات ناعمة وعالية الامتصاص للمولود الجديد.' }).returning({ id: products.id });
    const [p2]  = await db.insert(products).values({ name: 'بودي سوت قطن عضوي', price: 15.00, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80', category: 'ملابس', ageGroup: '0-6 months', description: 'ملابس ناعمة ومريحة للرضع.' }).returning({ id: products.id });
    const [p3]  = await db.insert(products).values({ name: 'زجاجة رضاعة مضادة للمغص', price: 12.00, image: 'https://images.unsplash.com/photo-1530651788726-1dbf58eeef1f?auto=format&fit=crop&w=800&q=80', category: 'الرضاعة', ageGroup: '0-6 months', description: 'زجاجة آمنة تمنع المغص.' }).returning({ id: products.id });
    const [p4]  = await db.insert(products).values({ name: 'مناديل مبللة للأطفال', price: 5.00, image: 'https://images.unsplash.com/photo-1584305574647-0cc919adecc3?auto=format&fit=crop&w=800&q=80', category: 'العناية بالطفل', ageGroup: '0-12 months', description: 'مناديل لطيفة على بشرة الطفل.' }).returning({ id: products.id });
    const [p5]  = await db.insert(products).values({ name: 'بطانية ناعمة للرضيع', price: 20.00, image: 'https://images.unsplash.com/photo-1596245842880-9ce0b53ef51b?auto=format&fit=crop&w=800&q=80', category: 'مستلزمات المولود', ageGroup: '0-6 months', description: 'بطانية دافئة ومريحة.' }).returning({ id: products.id });
    const [p6]  = await db.insert(products).values({ name: 'حمام مغطس للأطفال', price: 35.00, image: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?auto=format&fit=crop&w=800&q=80', category: 'العناية بالطفل', ageGroup: '0-12 months', description: 'مغطس آمن ومريح للاستحمام.' }).returning({ id: products.id });
    const [p7]  = await db.insert(products).values({ name: 'شامبو وصابون للأطفال', price: 10.00, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80', category: 'العناية بالطفل', ageGroup: '0-12 months', description: 'شامبو وصابون خفيف بدون دموع.' }).returning({ id: products.id });
    const [p8]  = await db.insert(products).values({ name: 'لعبة هرسلة ملونة', price: 18.00, image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', category: 'ألعاب', ageGroup: '6-12 months', description: 'لعبة ملونة تنمي مهارات الطفل.' }).returning({ id: products.id });
    const [p9]  = await db.insert(products).values({ name: 'حقيبة تغيير الحفاض', price: 45.00, image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80', category: 'الأمهات', ageGroup: '0-12 months', description: 'حقيبة عملية ومنظمة لجميع مستلزمات الطفل.' }).returning({ id: products.id });
    const [p10] = await db.insert(products).values({ name: 'كرسي هزاز للرضيع', price: 80.00, image: 'https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?auto=format&fit=crop&w=800&q=80', category: 'أثاث الأطفال', ageGroup: '0-6 months', description: 'كرسي هزاز مريح يهدئ الرضيع.' }).returning({ id: products.id });
    const [p11] = await db.insert(products).values({ name: 'مقتمر مشاية تعلم المشي', price: 55.00, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80', category: 'ألعاب', ageGroup: '1-2 years', description: 'مشاية آمنة تساعد الطفل على تعلم المشي.' }).returning({ id: products.id });
    const [p12] = await db.insert(products).values({ name: 'شاشة مراقبة الطفل', price: 90.00, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', category: 'أمان الطفل', ageGroup: '0-12 months', description: 'كاميرا مراقبة ذكية بجودة عالية.' }).returning({ id: products.id });

    // Seed 2 bundles
    const [b1] = await db.insert(bundles).values({ name: 'طقم المولود الجديد الأساسي', description: 'كل ما تحتاجه لاستقبال مولودك الجديد.', price: 70.00, image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80' }).returning({ id: bundles.id });
    await db.insert(bundleItems).values([
      { bundleId: b1.id, productId: p1.id, quantity: 2 },
      { bundleId: b1.id, productId: p2.id, quantity: 3 },
      { bundleId: b1.id, productId: p3.id, quantity: 1 },
      { bundleId: b1.id, productId: p4.id, quantity: 2 },
      { bundleId: b1.id, productId: p5.id, quantity: 1 },
    ]);

    const [b2] = await db.insert(bundles).values({ name: 'طقم العناية والاستحمام', description: 'مجموعة كاملة للعناية بنظافة طفلك.', price: 55.00, image: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?auto=format&fit=crop&w=800&q=80' }).returning({ id: bundles.id });
    await db.insert(bundleItems).values([
      { bundleId: b2.id, productId: p6.id, quantity: 1 },
      { bundleId: b2.id, productId: p7.id, quantity: 2 },
      { bundleId: b2.id, productId: p4.id, quantity: 3 },
    ]);

    res.json({ success: true, message: 'Seeded 12 products and 2 bundles!' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
