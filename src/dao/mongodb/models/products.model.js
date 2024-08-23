import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String },
    owner: { type: String, required: true, default: 'adminCoder@coder.com', validate: {
        validator: function(v) {
            // Validación de correo electrónico
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} no es un correo electrónico válido!`
    }},
});



productSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model('Product', productSchema);