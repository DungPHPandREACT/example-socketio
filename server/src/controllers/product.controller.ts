import Product, { IProduct } from "../models/product.model";

export const createProduct = async (data: IProduct) => {
    const product = new Product(data);
    return await product.save();
}

export const getProducts = async () => {
    return await Product.find();
}

export const updateProduct = async (id: string, data: IProduct) => {
    return await Product.findByIdAndUpdate(id, data, {new: true})
}

export const deleteProduct = async (id: string) => {
    return await Product.findByIdAndDelete(id);
}