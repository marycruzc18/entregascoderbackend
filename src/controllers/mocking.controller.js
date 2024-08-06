import { MockProducts } from "../utils/products.utils.js";

export const getMockProducts = (req,res) => {
    try {
        const mockProducts = MockProducts(100); 
        res.status(200).json(mockProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos ficticios' });
    }

}