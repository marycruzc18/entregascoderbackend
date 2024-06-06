import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  _id: false,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  products: [cartItemSchema]
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;

