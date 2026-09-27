import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { generateOrderNumber } from '@/lib/order-number';
import { generateCustomerId } from '@/lib/customer-id';


export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_phone_alt,
      shipping_address,
      area,
      city,
      landmark,
      items,
      payment_screenshot_url,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !city || !area) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const orderNumber = generateOrderNumber();

    // Reuse existing customer_id for same phone number, else generate new
    let customerId: string;
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('customer_id')
      .eq('customer_phone', customer_phone)
      .not('customer_id', 'is', null)
      .limit(1)
      .maybeSingle();

    customerId = existingOrder?.customer_id || generateCustomerId();

    // Verify stock and prices server-side against the database (never trust client-sent prices)
    const productIds = items.map((i: any) => i.product_id);
    const { data: dbProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, price, stock, is_active')
      .in('id', productIds);

    if (fetchError || !dbProducts) {
      return NextResponse.json({ error: 'Could not verify products.' }, { status: 500 });
    }

    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.product_id);
      if (!dbProduct || !dbProduct.is_active) {
        return NextResponse.json(
          { error: `${item.name} is no longer available.` },
          { status: 400 }
        );
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${dbProduct.name}. Only ${dbProduct.stock} left.` },
          { status: 400 }
        );
      }
      verifiedSubtotal += dbProduct.price * item.quantity;
      verifiedItems.push({
        product_id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    // Combine full address details into one clean, rider-friendly address string
    const fullAddress = [shipping_address, area, landmark ? `Near ${landmark}` : null, city]
      .filter(Boolean)
      .join(', ');

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_phone_alt: customer_phone_alt || null,
        shipping_address: fullAddress,
        city,
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        total: verifiedSubtotal,
        payment_method: 'easypaisa',
        payment_status: 'pending_verification',
        payment_screenshot_url: payment_screenshot_url || null,
        customer_id: customerId,
        order_status: 'pending',
      })
      .select()
      .single();

    if (insertError || !order) {
      console.error(insertError);
      return NextResponse.json({ error: 'Could not create order.' }, { status: 500 });
    }

    // Reduce stock immediately for COD orders
    for (const item of verifiedItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.product_id)!;
      await supabase
        .from('products')
        .update({ stock: dbProduct.stock - item.quantity })
        .eq('id', item.product_id);
    }

    return NextResponse.json({ order_number: order.order_number, order_id: order.id, customer_id: order.customer_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
